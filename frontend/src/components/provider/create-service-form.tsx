import {
  useForm,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProviderServiceSchema,
  type CreateProviderServiceFormData,
} from "../../schemas/provider-service.schema";
import {
  useCreateProviderService,
  type CreateProviderServiceData,
} from "../../hooks/use-provider-service";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { GeneralInfoSection } from "./general-info-section";
import { LocationSection } from "./location-section";
import { AvailabilitySection } from "./availability-section";

export function CreateServiceForm() {
  const {
    mutate: createService,
    isPending,
    error,
    isSuccess,
  } = useCreateProviderService();

  const methods = useForm<CreateProviderServiceFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateProviderServiceSchema) as any,
    defaultValues: {
      title: "",
      category: undefined,
      pricePerDay: 0,
      description: "",
      isActive: true,
      location: {
        type: "Point",
        coordinates: [0, 0],
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      availability: [],
    },
  });

  const onSubmit: SubmitHandler<CreateProviderServiceFormData> = (data) => {
    const serviceData: CreateProviderServiceData = {
      ...(data as CreateProviderServiceData),
      availability: data.availability || [],
    };
    createService(serviceData);
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-green-500/10 rounded-2xl border border-green-500/20">
        <h3 className="text-xl font-semibold text-green-400 mb-2">
          Service Created!
        </h3>
        <p className="text-muted-foreground">
          Your provider service has been successfully created and is now live.
        </p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Create Another
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error.message || "Failed to create service"}
          </div>
        )}

        <GeneralInfoSection />

        <div className="h-px bg-border w-full" />

        <LocationSection />

        <div className="h-px bg-border w-full" />

        <AvailabilitySection />

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Service...
              </>
            ) : (
              "Create Provider Service"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
