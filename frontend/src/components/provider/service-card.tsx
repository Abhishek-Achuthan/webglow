import { MapPin, Calendar, DollarSign, Tag, Edit2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import type { ProviderService } from "../../types/service.types";

interface ServiceCardProps {
  service: ProviderService;
  readOnly?: boolean;
}

export function ServiceCard({ service, readOnly = false }: ServiceCardProps) {
  const isAvailable = service.availability.length > 0;

  return (
    <Card className="p-5 bg-card border-border flex flex-col gap-4 hover:border-blue-500/40 transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base truncate">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">
            {service.description}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            service.isActive
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
          }`}
        >
          {service.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag className="w-3.5 h-3.5 shrink-0 text-blue-400" />
          <span className="truncate">{service.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <DollarSign className="w-3.5 h-3.5 shrink-0 text-green-400" />
          <span>₹{service.pricePerDay.toLocaleString()}/day</span>
        </div>
        {service.location.city && (
          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            <span className="truncate">
              {[service.location.city, service.location.state]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>
            {isAvailable
              ? `${service.availability.length} availability slot${service.availability.length > 1 ? "s" : ""}`
              : "No availability set"}
          </span>
        </div>
      </div>

      {/* Footer */}
      {!readOnly && (
        <div className="mt-2 pt-4 border-t border-border flex justify-end">
          <Link to="/provider/services/$serviceId/edit" params={{ serviceId: service._id }}>
            <Button variant="outline" size="sm" className="h-8">
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              Edit Service
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
