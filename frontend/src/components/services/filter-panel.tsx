import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LocationSearchInput } from "./location-search-input";
import { PROVIDER_CATEGORIES } from "../../constants/provider-categories.constant";
import type { ServiceFilters } from "../../types/service.types";

interface FilterPanelProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [locationLabel, setLocationLabel] = useState("");

  const handleChange = (
    key: keyof ServiceFilters,
    value: string | number | undefined,
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleLocationSelect = (
    lat: number,
    lng: number,
    displayName: string,
  ) => {
    setLocationLabel(displayName);
    onFiltersChange({ ...filters, lat, lng });
  };

  const handleLocationClear = () => {
    setLocationLabel("");
    const rest = { ...filters };
    delete rest.lat;
    delete rest.lng;
    delete rest.radiusKm;
    onFiltersChange(rest);
  };

  const handleReset = () => {
    setLocationLabel("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.lat !== undefined ||
    filters.availableFrom ||
    filters.availableTo ||
    filters.search;

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            id="filter-search"
            type="text"
            placeholder="Search title or description..."
            value={filters.search ?? ""}
            onChange={(e) =>
              handleChange("search", e.target.value || undefined)
            }
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Category
        </label>
        <select
          id="filter-category"
          value={filters.category ?? ""}
          onChange={(e) =>
            handleChange("category", e.target.value || undefined)
          }
          className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        >
          <option value="">All Categories</option>
          {PROVIDER_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Price Range (₹/day)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            id="filter-min-price"
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              handleChange(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
          <input
            id="filter-max-price"
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              handleChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Location
        </label>
        <LocationSearchInput
          value={locationLabel}
          onSelect={handleLocationSelect}
          onClear={handleLocationClear}
        />
        {filters.lat !== undefined && (
          <div className="space-y-1.5 mt-2">
            <label className="text-xs text-muted-foreground">Radius (km)</label>
            <input
              id="filter-radius"
              type="number"
              min={1}
              max={500}
              placeholder="50"
              value={filters.radiusKm ?? ""}
              onChange={(e) =>
                handleChange(
                  "radiusKm",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Availability
        </label>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              From
            </label>
            <Popover>
              {/* @ts-expect-error asChild type issue */}
              <PopoverTrigger asChild>
                <Button
                  id="filter-available-from"
                  variant={"outline"}
                  className={cn(
                    "w-full h-10 px-3 justify-start text-left font-normal rounded-lg bg-background border border-border text-sm",
                    !filters.availableFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.availableFrom ? (
                    format(
                      parse(filters.availableFrom, "yyyy-MM-dd", new Date()),
                      "PPP",
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.availableFrom
                      ? parse(filters.availableFrom, "yyyy-MM-dd", new Date())
                      : undefined
                  }
                  onSelect={(date) =>
                    handleChange(
                      "availableFrom",
                      date ? format(date, "yyyy-MM-dd") : undefined,
                    )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              To
            </label>
            <Popover>
              {/* @ts-expect-error asChild type issue */}
              <PopoverTrigger asChild>
                <Button
                  id="filter-available-to"
                  variant={"outline"}
                  className={cn(
                    "w-full h-10 px-3 justify-start text-left font-normal rounded-lg bg-background border border-border text-sm",
                    !filters.availableTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.availableTo ? (
                    format(
                      parse(filters.availableTo, "yyyy-MM-dd", new Date()),
                      "PPP",
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.availableTo
                      ? parse(filters.availableTo, "yyyy-MM-dd", new Date())
                      : undefined
                  }
                  onSelect={(date) =>
                    handleChange(
                      "availableTo",
                      date ? format(date, "yyyy-MM-dd") : undefined,
                    )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </aside>
  );
}
