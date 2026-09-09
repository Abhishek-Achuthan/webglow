import { createFileRoute } from '@tanstack/react-router';
import { AdminBookingsPage } from '@/pages/admin.bookings';

export const Route = createFileRoute('/admin/bookings')({
  component: AdminBookingsPage,
});
