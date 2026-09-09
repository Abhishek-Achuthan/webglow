import { createFileRoute } from '@tanstack/react-router';
import { ProviderEditServicePage } from '@/pages/provider.edit-service';

export const Route = createFileRoute('/provider/services/$serviceId/edit')({
  component: function EditRoute() {
    const { serviceId } = Route.useParams();
    return <ProviderEditServicePage serviceId={serviceId} />;
  },
});
