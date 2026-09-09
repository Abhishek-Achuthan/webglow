import { ProviderDashboardPage } from '@/pages/provider.dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/provider/')({
  component: ProviderDashboardPage,
});
