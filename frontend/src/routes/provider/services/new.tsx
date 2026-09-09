import { ProviderCreateServicePage } from '@/pages/provider.create-service';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/provider/services/new')({
  component: ProviderCreateServicePage,
});
