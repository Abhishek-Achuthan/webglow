import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchInputProps {
  onSelect: (lat: number, lng: number, displayName: string) => void;
  onClear: () => void;
  value: string;
}

export function LocationSearchInput({ onSelect, onClear, value }: LocationSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelect = (result: NominatimResult) => {
    const displayName = result.display_name.split(',').slice(0, 3).join(', ');
    setQuery(displayName);
    setShowDropdown(false);
    setResults([]);
    onSelect(parseFloat(result.lat), parseFloat(result.lon), displayName);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onClear();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          id="location-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search location..."
          className="w-full h-10 pl-9 pr-8 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : query ? (
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg overflow-hidden z-50 shadow-lg">
          {results.map((result) => (
            <li key={result.place_id}>
              <button
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors flex items-start gap-2"
              >
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400" />
                <span className="line-clamp-2">{result.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
