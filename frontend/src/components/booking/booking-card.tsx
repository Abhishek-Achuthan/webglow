import { format, parseISO } from 'date-fns';
import { Calendar, Clock, IndianRupee, X } from 'lucide-react';
import { Button } from '../ui/button';
import type { Booking } from '../../types/booking.types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

const statusConfig = {
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

export function BookingCard({ booking, onCancel, isCancelling }: BookingCardProps) {
  const service = typeof booking.serviceId === 'object' ? booking.serviceId : null;
  const serviceTitle = service?.title ?? 'Service';
  const serviceCategory = service?.category ?? '';

  const startDate = parseISO(booking.startDate);
  const endDate = parseISO(booking.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canCancel = booking.status === 'CONFIRMED' && startDate > today;
  const status = statusConfig[booking.status];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4 hover:border-blue-500/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-base truncate">{serviceTitle}</h3>
          {serviceCategory && (
            <p className="text-xs text-muted-foreground mt-0.5">{serviceCategory}</p>
          )}
        </div>
        <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 shrink-0" />
        <span>
          {format(startDate, 'MMM dd, yyyy')} → {format(endDate, 'MMM dd, yyyy')}
        </span>
      </div>

      {/* Duration + Price */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{booking.numberOfDays} day{booking.numberOfDays !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-green-400">
          <IndianRupee className="w-4 h-4" />
          <span>{booking.totalAmount.toLocaleString()}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          ₹{booking.pricePerDay.toLocaleString()}/day
        </span>
      </div>

      {/* Cancel action */}
      {canCancel && onCancel && (
        <div className="pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 w-full"
            onClick={() => onCancel(booking._id)}
            disabled={isCancelling}
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Cancel Booking
          </Button>
        </div>
      )}
    </div>
  );
}
