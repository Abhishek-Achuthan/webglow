import { MapPin, DollarSign, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { ProviderService } from '../../types/service.types';

interface ServiceBrowseCardProps {
  service: ProviderService;
}

const CATEGORY_COLORS: Record<string, string> = {
  Photography: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Videography: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Catering: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Venue: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Decoration: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Music & Entertainment': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Makeup & Styling': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Event Planning': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

export function ServiceBrowseCard({ service }: ServiceBrowseCardProps) {
  const categoryColor = CATEGORY_COLORS[service.category] ?? CATEGORY_COLORS['Other'];
  const availabilityCount = service.availability.length;

  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col">
      {/* Color band */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
            {service.title}
          </h3>
          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${categoryColor}`}>
            {service.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{service.description}</p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="font-semibold text-foreground">
              ₹{service.pricePerDay.toLocaleString()}
            </span>
            <span className="text-muted-foreground">/ day</span>
          </div>

          {(service.location.city || service.location.address) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {[service.location.city, service.location.state]
                  .filter(Boolean)
                  .join(', ') || service.location.address}
              </span>
            </div>
          )}

          {availabilityCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {availabilityCount} slot{availabilityCount > 1 ? 's' : ''} available
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to="/services/$serviceId"
          params={{ serviceId: service._id }}
          className="mt-auto flex items-center justify-center w-full h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
