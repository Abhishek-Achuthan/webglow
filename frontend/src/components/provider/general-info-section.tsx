
import { useFormContext } from "react-hook-form";
import type { UpdateProviderServiceFormData } from "../../schemas/provider-service.schema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PROVIDER_CATEGORIES } from "../../constants/provider-categories.constant";

export function GeneralInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateProviderServiceFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          General Information
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Provide basic details about your service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Service Title</Label>
          <Input
            id="title"
            placeholder="e.g. Professional Photography"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-400 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register("category")}
          >
            <option value="" disabled>Select a category...</option>
            {PROVIDER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerDay">Price Per Day ($)</Label>
          <Input
            id="pricePerDay"
            type="number"
            min="0"
            placeholder="0.00"
            {...register("pricePerDay")}
          />
          {errors.pricePerDay && (
            <p className="text-red-400 text-sm">
              {errors.pricePerDay.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number (Optional)</Label>
          <Input
            id="contact"
            placeholder="+1 (555) 000-0000"
            {...register("contact")}
          />
          {errors.contact && (
            <p className="text-red-400 text-sm">{errors.contact.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          placeholder="Describe your service in detail..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-400 text-sm">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
