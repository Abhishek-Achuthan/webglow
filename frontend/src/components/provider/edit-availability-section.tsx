import { useFormContext, useFieldArray } from 'react-hook-form';
import type { UpdateProviderServiceFormData } from '../../schemas/provider-service.schema';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Plus, Trash2, CalendarRange } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export function EditAvailabilitySection() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<UpdateProviderServiceFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availability',
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-foreground">Availability</h3>
            <p className="text-sm text-muted-foreground">
              Manage the date ranges when this service is available.
              Existing slots are pre-filled; edit, remove, or add new ones.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ startDate: todayStr, endDate: todayStr })}
          className="shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const startDateValue = watch(`availability.${index}.startDate`);
            const slotErrors = errors.availability?.[index];

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted border border-border group">
                  <span className="mt-8 shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                    {index + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`availability-start-${index}`}>
                        Start Date
                      </Label>
                      <Input
                        id={`availability-start-${index}`}
                        type="date"
                        {...register(`availability.${index}.startDate` as const)}
                      />
                      {slotErrors?.startDate && (
                        <p className="text-red-400 text-xs">
                          {slotErrors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`availability-end-${index}`}>
                        End Date
                      </Label>
                      <Input
                        id={`availability-end-${index}`}
                        type="date"
                        min={startDateValue || undefined}
                        {...register(`availability.${index}.endDate` as const)}
                      />
                      {slotErrors?.endDate && (
                        <p className="text-red-400 text-xs">
                          {slotErrors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-60 group-hover:opacity-100 transition-opacity"
                    onClick={() => remove(index)}
                    title="Remove this slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {fields.length === 0 && (
          <div className="text-center p-8 rounded-xl border border-dashed border-border text-muted-foreground space-y-2">
            <CalendarRange className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm">No availability slots.</p>
            <p className="text-xs">Click &ldquo;Add Slot&rdquo; to specify when you&rsquo;re available.</p>
          </div>
        )}
      </div>

      {errors.availability && !Array.isArray(errors.availability) && (
        <p className="text-red-400 text-sm">
          {(errors.availability as { message?: string }).message}
        </p>
      )}
    </div>
  );
}
