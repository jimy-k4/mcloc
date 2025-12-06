"use client"

import type React from "react"

import { Search, Grid3X3, List, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LOCATION_TYPES, getLocationIcon } from "@/lib/location-config"
import type { LocationType } from "@/lib/types"

interface FilterBarProps {
  activeFilter: LocationType | "all" | "favorites"
  onFilterChange: (filter: LocationType | "all" | "favorites") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar ubicaciones..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 bg-card border-border/50 font-mono text-lg placeholder:text-muted-foreground/50"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary/20 text-primary" : ""}`}
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${viewMode === "list" ? "bg-primary/20 text-primary" : ""}`}
            onClick={() => onViewModeChange("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={activeFilter === "all"}
          onClick={() => onFilterChange("all")}
          icon={<Grid3X3 className="w-4 h-4" />}
          label="TODOS"
        />
        <FilterChip
          active={activeFilter === "favorites"}
          onClick={() => onFilterChange("favorites")}
          icon={<Star className="w-4 h-4" />}
          label="FAVORITOS"
          highlight
        />
        {LOCATION_TYPES.map((type) => (
          <FilterChip
            key={type.value}
            active={activeFilter === type.value}
            onClick={() => onFilterChange(type.value)}
            icon={getLocationIcon(type.value)}
            label={type.label.toUpperCase()}
          />
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  icon,
  label,
  highlight,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider
        border transition-all duration-200
        ${
          active
            ? highlight
              ? "bg-amber-500 text-black border-amber-500"
              : "bg-primary text-primary-foreground border-primary"
            : highlight
              ? "bg-card/50 text-amber-500 border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10"
              : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}
