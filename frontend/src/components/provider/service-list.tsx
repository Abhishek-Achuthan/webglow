import { useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ServiceCard } from './service-card';
import type { ProviderService } from '../../types/service.types';

interface ServiceListProps {
  services: ProviderService[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

export function ServiceList({
  services,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  isLoading,
}: ServiceListProps) {
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
