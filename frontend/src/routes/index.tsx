import { createFileRoute } from '@tanstack/react-router';
import { ServicesListPage } from '../pages/services.list';

export const Route = createFileRoute('/')({
  component: ServicesListPage,
});
