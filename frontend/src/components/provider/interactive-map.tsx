import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Fix for default marker icon in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface InteractiveMapProps {
  defaultLocation?: [number, number];
  onLocationSelect: (location: MapLocation) => void;
}

// Component to handle map clicks and marker updates
function MapClickHandler({
  position,
  setPosition,
  onLocationSelect,
  setIsGeocoding,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  onLocationSelect: (location: MapLocation) => void;
  setIsGeocoding: (val: boolean) => void;
}) {
  const map = useMapEvents({
    click: async (e: L.LeafletMouseEvent) => {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      await reverseGeocode(newPos, onLocationSelect, setIsGeocoding);
    },
  });

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} />;
}

async function reverseGeocode(
  [lat, lng]: [number, number],
  onLocationSelect: (location: MapLocation) => void,
  setIsGeocoding: (val: boolean) => void,
) {
  setIsGeocoding(true);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();

    if (data && data.address) {
      const addressComponents = data.address;

      const city =
        addressComponents.city ||
        addressComponents.town ||
        addressComponents.village ||
        addressComponents.county ||
        "";
      const state = addressComponents.state || "";
      const zipCode = addressComponents.postcode || "";

      // Attempt to build a street address
      const road = addressComponents.road || "";
      const houseNumber = addressComponents.house_number || "";
      const address = [houseNumber, road].filter(Boolean).join(" ");

      onLocationSelect({
        lat,
        lng,
        address,
        city,
        state,
        zipCode,
      });
    } else {
      onLocationSelect({ lat, lng });
    }
  } catch (error) {
    console.error("Failed to reverse geocode:", error);
    onLocationSelect({ lat, lng });
  } finally {
    setIsGeocoding(false);
  }
}

export function InteractiveMap({
  defaultLocation = [20.5937, 78.9629],
  onLocationSelect,
}: InteractiveMapProps) {
  const [position, setPosition] = useState<[number, number]>(defaultLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newPos: [number, number] = [
          parseFloat(result.lat),
          parseFloat(result.lon),
        ];
        setPosition(newPos);

        const addressComponents = result.address || {};
        const city =
          addressComponents.city ||
          addressComponents.town ||
          addressComponents.village ||
          addressComponents.county ||
          "";
        const state = addressComponents.state || "";
        const zipCode = addressComponents.postcode || "";

        const road = addressComponents.road || "";
        const houseNumber = addressComponents.house_number || "";
        const address = [houseNumber, road].filter(Boolean).join(" ");

        onLocationSelect({
          lat: newPos[0],
          lng: newPos[1],
          address,
          city,
          state,
          zipCode,
        });
      }
    } catch (error) {
      console.error("Failed to search location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for a location to drop a pin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          variant="secondary"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      <div className="relative w-full h-[350px] rounded-xl overflow-hidden border border-border shadow-sm">
        {isGeocoding && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-[1000] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
        <MapContainer
          center={position}
          zoom={4}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            position={position}
            setPosition={setPosition}
            onLocationSelect={onLocationSelect}
            setIsGeocoding={setIsGeocoding}
          />
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Click anywhere on the map to drop a pin. This will automatically fill in
        the address fields below.
      </p>
    </div>
  );
}
