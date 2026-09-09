import { useEffect } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  UpdateProviderServiceSchema,
  type UpdateProviderServiceFormData,
} from '../../schemas/provider-service.schema';
import {
  useGetServiceById,
  useUpdateProviderService,
  type UpdateProviderServiceData,
} from '../../hooks/use-provider-service';
import { Button } from '../ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { GeneralInfoSection } from './general-info-section';
import { LocationSection } from './location-section';
import { EditAvailabilitySection } from './edit-availability-section';


function toDateInputValue(isoString: string): string {
  if (!isoString) return '';
  return isoString.slice(0, 10);
}

interface EditServiceFormProps {
  serviceId: string;
}

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: service,
    isLoading: isLoadingService,
    isError: isLoadError,
  } = useGetServiceById(serviceId);

  const {
    mutate: updateService,
    isPending,
    error,
    isSuccess,
  } = useUpdateProviderService(serviceId);

  const methods = useForm<UpdateProviderServiceFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(UpdateProviderServiceSchema) as any,
    defaultValues: {
      title: '',
      category: undefined,
      pricePerDay: 0,
      description: '',
      isActive: true,
      location: {
        type: 'Point' as const,
        coordinates: [0, 0],
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      availability: [],
    },
  });

  useEffect(() => {
    if (!service) return;

    methods.reset({
      title: service.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: service.category as any,
      pricePerDay: service.pricePerDay,
      description: service.description,
      contact: service.contact ?? '',
      isActive: service.isActive,
      location: {
        type: (service.location.type ?? 'Point') as 'Point',
        coordinates: service.location.coordinates as [number, number],
        address: service.location.address ?? '',
        city: service.location.city ?? '',
        state: service.location.state ?? '',
        zipCode: service.location.zipCode ?? '',
      },
      availability: (service.availability ?? []).map((slot) => ({
        startDate: toDateInputValue(slot.startDate),
        endDate: toDateInputValue(slot.endDate),
      })),
    });
  }, [service, methods]);

  const onSubmit: SubmitHandler<UpdateProviderServiceFormData> = (data) => {
    const serviceData: UpdateProviderServiceData = {
      ...data,
      availability: data.availability ?? [],
    };

    updateService(serviceData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['provider-service', serviceId] });
        queryClient.invalidateQueries({ queryKey: ['my-services'] });
      },
    });
  };

  if (isLoadingService) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="text-muted-foreground text-sm">Loading service details…</p>
      </div>
    );
  }

  if (isLoadError || !service) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
        Failed to load service. It may not exist or you may not have permission to edit it.
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-green-500/10 rounded-2xl border border-green-500/20 flex flex-col items-center gap-4">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-1">Service Updated!</h3>
          <p className="text-muted-foreground text-sm">
            Your changes have been saved successfully.
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => navigate({ to: '/provider/services' })}
        >
          Back to My Services
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error.message || 'Failed to update service'}
          </div>
        )}

        <GeneralInfoSection />

        <div className="h-px bg-border w-full" />

        <LocationSection />

        <div className="h-px bg-border w-full" />

        <EditAvailabilitySection />

        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
          <input
            id="isActive"
            type="checkbox"
            className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
            {...methods.register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer select-none">
            Service is active and visible to customers
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving Changes…
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
