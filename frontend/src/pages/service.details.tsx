import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBrowseServiceById } from '../hooks/use-provider-service';
import { Loader2, ArrowLeft, MapPin, Tag, Mail, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { format, parseISO } from 'date-fns';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { BookingPanel } from '../components/booking/booking-panel';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export function ServiceDetailsPage() {
  const { serviceId } = useParams({ strict: false }) as { serviceId: string };
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: service, isLoading, isError } = useGetBrowseServiceById(serviceId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Loading service details...</p>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Service Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          The service you are looking for doesn't exist or is no longer available.
        </p>
        <Button onClick={() => navigate({ to: '/services' })}>
          Back to Services
        </Button>
      </div>
    );
  }

  const locationString = [service.location.address, service.location.city, service.location.state, service.location.zipCode]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              {service.category}
            </span>
            {service.isActive && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Core Info */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* Title & Price Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
                {service.title}
              </h1>
              <div className="flex items-baseline gap-1.5 text-green-600 dark:text-green-500">
                <span className="text-2xl sm:text-3xl font-bold">
                  ₹{service.pricePerDay.toLocaleString()}
                </span>
                <span className="text-muted-foreground font-medium text-sm">/ day</span>
              </div>
            </div>

            <hr className="border-border" />

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">About this service</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                {service.description}
              </div>
            </section>

            <hr className="border-border" />

            {/* Location */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                Location
              </h2>
              <p className="text-muted-foreground text-[15px]">
                {locationString || 'Location details not provided.'}
              </p>
              {service.location.coordinates && service.location.coordinates.length === 2 && (
                <div className="w-full h-64 sm:h-[350px] bg-muted rounded-2xl border border-border overflow-hidden relative z-0 shadow-sm mt-4">
                  <MapContainer
                    center={[service.location.coordinates[1], service.location.coordinates[0]]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[service.location.coordinates[1], service.location.coordinates[0]]} />
                  </MapContainer>
                </div>
              )}
            </section>

            <hr className="border-border" />

            {/* Availability */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Availability
              </h2>
              {service.availability && service.availability.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {service.availability.map((slot, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-medium text-foreground">
                          {format(parseISO(slot.startDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">To</span>
                        <span className="font-medium text-foreground">
                          {format(parseISO(slot.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-muted/30 rounded-xl border border-border border-dashed mt-2">
                  <p className="text-muted-foreground text-sm font-medium">No specific availability slots listed.</p>
                </div>
              )}
            </section>

            {/* Contact */}
            {service.contact && (
              <>
                <hr className="border-border" />
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    Contact Provider
                  </h2>
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div>
                      <p className="text-muted-foreground mb-1 text-[15px]">
                        Have questions? You can reach out directly:
                      </p>
                      <a href={`mailto:${service.contact}`} className="text-blue-500 font-medium hover:underline">
                        {service.contact}
                      </a>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right Column: Sticky Booking Panel */}
          <div className="lg:col-span-5 xl:col-span-4 mt-4 lg:mt-0">
            <div className="sticky top-24">
              <BookingPanel service={service} currentUser={currentUser} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
