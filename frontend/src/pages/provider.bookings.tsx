import { Loader2, Package, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useProviderBookings } from '../hooks/use-booking';
import type { Booking } from '../types/booking.types';

export function ProviderBookingsPage() {
  const { data, isLoading, isError } = useProviderBookings();
  const bookings: Booking[] = (data?.data as Booking[]) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-muted-foreground">Failed to load bookings.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-500/10 text-green-400 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-background/50">
      {/* Header */}
      <div className="relative border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Service Bookings
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                All bookings made for your services
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-sm">No one has booked your services yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Service</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Dates</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Days</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => {
                  const user = typeof booking.userId === 'object' ? (booking.userId as { name?: string, email?: string }) : null;
                  const service = typeof booking.serviceId === 'object' ? booking.serviceId : null;

                  return (
                    <tr key={booking._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{user?.name ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">{user?.email ?? ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{service?.title ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">{service?.category ?? ''}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(parseISO(booking.startDate), 'MMM dd')} → {format(parseISO(booking.endDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{booking.numberOfDays}d</td>
                      <td className="px-4 py-3 font-semibold text-green-400">
                        ₹{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[booking.status] ?? ''}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
