import { useState, useMemo, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, LayoutGrid, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ServiceList } from '../components/provider/service-list';
import { useMyServices } from '../hooks/use-provider-service';
import type { ProviderService } from '../types/service.types';

export function ProviderServicesListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useMyServices({ limit: 10, search: debouncedSearch || undefined });

  const services: ProviderService[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const totalServices = data?.pages[0]?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>My Services</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Listings
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground mt-1">
              {totalServices} service{totalServices !== 1 ? 's' : ''} listed
            </p>
          )}
        </div>
        <Link to="/provider/services/new">
          <Button
            id="create-service-btn"
            className="w-full md:w-auto h-11 px-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-500/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Service
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search your services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        />
      </div>

      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          Failed to load services. Please try again.
        </div>
      )}

      {!isLoading && services.length === 0 && !isError && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Services Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't created any services yet. Start by creating your first listing.
          </p>
          <Link to="/provider/services/new">
            <Button variant="outline" className="border-border hover:bg-accent">
              Create Service
            </Button>
          </Link>
        </div>
      )}

      <ServiceList
        services={services}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
