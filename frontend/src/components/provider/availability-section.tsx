
import { useFormContext, useFieldArray } from "react-hook-form";
import type { UpdateProviderServiceFormData } from "../../schemas/provider-service.schema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AvailabilitySection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateProviderServiceFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Availability</h3>
          <p className="text-sm text-muted-foreground">
            When is your service available?
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ startDate: "", endDate: "" })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted border border-border"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    {...register(`availability.${index}.startDate` as const)}
                  />
                  {errors.availability?.[index]?.startDate && (
                    <p className="text-red-400 text-sm">
                      {errors.availability[index]?.startDate?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    {...register(`availability.${index}.endDate` as const)}
                  />
                  {errors.availability?.[index]?.endDate && (
                    <p className="text-red-400 text-sm">
                      {errors.availability[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <div className="text-center p-8 rounded-xl border border-dashed border-border text-muted-foreground">
            No availability slots added. Click "Add Slot" to specify when
            you're available.
          </div>
        )}
      </div>
    </div>
  );
}
