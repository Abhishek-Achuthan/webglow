import { createFileRoute } from '@tanstack/react-router';
import { ProviderServicesListPage } from '@/pages/provider.services-list';

export const Route = createFileRoute('/provider/services/')({
  component: ProviderServicesListPage,
});
