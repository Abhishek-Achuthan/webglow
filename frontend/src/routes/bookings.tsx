import { createFileRoute } from '@tanstack/react-router';
import { MyBookingsPage } from '@/pages/my-bookings';

export const Route = createFileRoute('/bookings')({
  component: MyBookingsPage,
});
