import { useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ServiceBrowseCard } from './service-browse-card';
import type { ProviderService } from '../../types/service.types';

interface ServicesGridProps {
  services: ProviderService[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export function ServicesGrid({
  services,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: ServicesGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        onLoadMore();
      }
    },
    [hasNextPage, isFetchingNextPage, onLoadMore],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!isLoading && services.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or clearing the location search to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceBrowseCard key={service._id} service={service} />
        ))}
      </div>

      <div ref={sentinelRef} className="py-6 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
