import { useState } from 'react';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { useMyBookings, useCancelBooking } from '../hooks/use-booking';
import { BookingCard } from '../components/booking/booking-card';
import type { Booking } from '../types/booking.types';

type TabFilter = 'all' | 'upcoming' | 'past' | 'cancelled';

function filterBookings(bookings: Booking[], filter: TabFilter): Booking[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filter) {
    case 'upcoming':
      return bookings.filter(
        (b) => b.status === 'CONFIRMED' && new Date(b.startDate) >= today,
      );
    case 'past':
      return bookings.filter(
        (b) => b.status === 'CONFIRMED' && new Date(b.startDate) < today,
      );
    case 'cancelled':
      return bookings.filter((b) => b.status === 'CANCELLED');
    default:
      return bookings;
  }
}

const tabs: { label: string; value: TabFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const { data, isLoading, isError } = useMyBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const bookings: Booking[] = (data?.data as Booking[]) ?? [];
  const filtered = filterBookings(bookings, activeTab);

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

  return (
    <div className="min-h-screen bg-background/50">
      {/* Header */}
      <div className="relative border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                My Bookings
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage and track all your service bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => {
            const count = filterBookings(bookings, tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value ? 'bg-blue-500/20' : 'bg-muted'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bookings Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {activeTab === 'all'
                ? "You haven't made any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={(id) => cancelBooking(id)}
                isCancelling={isCancelling}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
