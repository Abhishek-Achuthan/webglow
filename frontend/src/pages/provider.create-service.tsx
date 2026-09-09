import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { CreateServiceForm } from '../components/provider/create-service-form';

export function ProviderCreateServicePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link 
          to="/provider" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Create New Service</h1>
        <p className="text-muted-foreground">
          Fill out the details below to list a new service on the platform. 
          Be descriptive to attract more customers.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 backdrop-blur-xl">
        <CreateServiceForm />
      </div>
    </div>
  );
}
