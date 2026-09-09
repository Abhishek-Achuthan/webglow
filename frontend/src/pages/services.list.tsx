import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { FilterPanel } from '../components/services/filter-panel';
import { ServicesGrid } from '../components/services/services-grid';
import { useBrowseServices } from '../hooks/use-provider-service';
import type { ServiceFilters, ProviderService } from '../types/service.types';

export function ServicesListPage() {
  const [filters, setFilters] = useState<ServiceFilters>({ limit: 12 });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useBrowseServices(filters);

  const services: ProviderService[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const totalServices = data?.pages[0]?.total ?? 0;

  const handleFiltersChange = (newFilters: ServiceFilters) => {
    setFilters({ ...newFilters, limit: 12 });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-background via-blue-950/10 to-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Discover Services</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Find the Perfect Service
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse venues, caterers, photographers, and more — all in one place. Use the filters to
            narrow by location, budget, and availability.
          </p>
          {!isLoading && totalServices > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{totalServices}</span> services
              available
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            Failed to load services. Please try again.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} />

          <ServicesGrid
            services={services}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
}
