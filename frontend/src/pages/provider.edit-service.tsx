import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { EditServiceForm } from '../components/provider/edit-service-form';

interface ProviderEditServicePageProps {
  serviceId: string;
}

export function ProviderEditServicePage({
  serviceId,
}: ProviderEditServicePageProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          to="/provider/services"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Services
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Edit Service
        </h1>
        <p className="text-muted-foreground">
          Update your service details below. Changes will be saved immediately
          and reflected to customers.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 backdrop-blur-xl">
        <EditServiceForm serviceId={serviceId} />
      </div>
    </div>
  );
}
