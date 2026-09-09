import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CalendarDays, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, differenceInCalendarDays, isBefore, startOfToday, isWithinInterval, parseISO } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { useCreateBooking, useAvailableDates } from '../../hooks/use-booking';
import type { ProviderService } from '../../types/service.types';
import type { User } from '../../store/slices/auth.slice';

interface BookingPanelProps {
  service: ProviderService;
  currentUser: User | null;
}

function isDateBlocked(
  date: Date,
  availabilityRanges: { start: string; end: string }[],
  bookedRanges: { start: string; end: string }[],
): boolean {
  const today = startOfToday();
  if (isBefore(date, today)) return true;

  const inAvailability = availabilityRanges.some((range) =>
    isWithinInterval(date, {
      start: parseISO(range.start),
      end: parseISO(range.end),
    }),
  );
  if (!inAvailability) return true;

  const inBooked = bookedRanges.some((range) =>
    isWithinInterval(date, {
      start: parseISO(range.start),
      end: parseISO(range.end),
    }),
  );
  return inBooked;
}

export function BookingPanel({ service, currentUser }: BookingPanelProps) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<'start' | 'end'>('start');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: availableDates, isLoading: isLoadingDates } = useAvailableDates(service._id);
  const { mutate: createBooking, isPending } = useCreateBooking();

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return differenceInCalendarDays(endDate, startDate);
  }, [startDate, endDate]);

  const totalAmount = numberOfDays * service.pricePerDay;

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    if (step === 'start') {
      setStartDate(day);
      setEndDate(undefined);
      setStep('end');
    } else {
      if (startDate && isBefore(day, startDate)) {
        // If user picks an end before start, swap
        setStartDate(day);
        setEndDate(undefined);
        setStep('end');
        return;
      }
      setEndDate(day);
    }
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStep('start');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleBook = () => {
    if (!currentUser) {
      navigate({ to: '/login' });
      return;
    }
    if (!startDate || !endDate) return;

    createBooking(
      {
        serviceId: service._id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      {
        onSuccess: () => {
          setSuccessMessage('Your booking has been confirmed!');
          setErrorMessage(null);
        },
        onError: (error: unknown) => {
          const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong. Please try again.';
          setErrorMessage(msg);
          setSuccessMessage(null);
        },
      },
    );
  };

  const modifiers = useMemo(() => {
    const ranges = availableDates?.availabilityRanges ?? [];
    const booked = availableDates?.bookedRanges ?? [];
    return {
      booked: booked.map((r) => ({
        from: parseISO(r.start),
        to: parseISO(r.end),
      })),
      selected: startDate && endDate ? [{ from: startDate, to: endDate }] : [],
      rangeStart: startDate ? [startDate] : [],
      rangeEnd: endDate ? [endDate] : [],
      disabled: (day: Date) => isDateBlocked(day, ranges, booked),
    };
  }, [availableDates, startDate, endDate]);

  if (successMessage) {
    return (
      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground mb-6">{successMessage}</p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate({ to: '/bookings' })} className="w-full">
            View My Bookings
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full">
            Book Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Book This Service</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className={`px-3 py-1 rounded-full transition-colors ${step === 'start' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : startDate ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-muted-foreground border border-border'}`}>
          1. Pick start date
        </span>
        <span className="text-muted-foreground/40">→</span>
        <span className={`px-3 py-1 rounded-full transition-colors ${step === 'end' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : endDate ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-muted-foreground border border-border'}`}>
          2. Pick end date
        </span>
      </div>

      {/* Calendar */}
      {isLoadingDates ? (
        <div className="flex items-center justify-center h-[350px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex justify-center bg-background/50 rounded-2xl p-4 sm:p-6 border border-border shadow-inner">
          <Calendar
            mode="single"
            selected={step === 'start' ? startDate : endDate}
            onSelect={handleDaySelect}
            disabled={modifiers.disabled}
            className="w-full flex justify-center bg-transparent border-0 [--cell-size:36px] sm:[--cell-size:40px] [--cell-radius:10px] p-0"
            classNames={{
              day: "group/day relative aspect-square h-full w-full rounded-[var(--cell-radius)] p-0 text-center select-none text-sm font-medium transition-all hover:scale-105",
            }}
            modifiers={{
              booked: modifiers.booked,
              rangeMiddle: startDate && endDate ? [{ from: startDate, to: endDate }] : [],
            }}
            modifiersClassNames={{
              booked: 'opacity-40 line-through cursor-not-allowed bg-red-500/5 text-red-500 hover:scale-100',
              rangeMiddle: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold rounded-none scale-100 hover:scale-100',
            }}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30 inline-block" />
          Selected range
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-muted border border-border inline-block" />
          Unavailable
        </span>
      </div>

      {/* Selection summary */}
      {startDate && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start</span>
            <span className="font-semibold text-foreground">{format(startDate, 'MMM dd, yyyy')}</span>
          </div>
          {endDate && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End</span>
                <span className="font-semibold text-foreground">{format(endDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold text-foreground">{numberOfDays} day{numberOfDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price/day</span>
                <span className="font-medium text-foreground">₹{service.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-green-400 text-base">₹{totalAmount.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {(startDate || endDate) && (
          <Button variant="outline" onClick={handleReset} className="flex-1" disabled={isPending}>
            Reset
          </Button>
        )}
        <Button
          className="flex-1 font-semibold shadow-lg shadow-blue-500/20"
          disabled={!startDate || !endDate || numberOfDays <= 0 || isPending}
          onClick={handleBook}
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>
          ) : !currentUser ? (
            'Login to Book'
          ) : !startDate ? (
            'Select Start Date'
          ) : !endDate ? (
            'Select End Date'
          ) : (
            `Book for ₹${totalAmount.toLocaleString()}`
          )}
        </Button>
      </div>
    </div>
  );
}
