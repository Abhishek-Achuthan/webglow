import { createFileRoute } from '@tanstack/react-router';
import { ProviderBookingsPage } from '@/pages/provider.bookings';

export const Route = createFileRoute('/provider/bookings')({
  component: ProviderBookingsPage,
});
