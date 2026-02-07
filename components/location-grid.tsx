"use client"

import { useState } from "react"
import { Trash2, Pencil, Star, ArrowRightLeft } from "lucide-react"
import { overworldToNether } from "@/lib/coordinate-conversion"
import { Button } from "@/components/ui/button"
import { getLocationIcon, getDimensionColor, getDimensionLabel, getTypeLabel } from "@/lib/location-config"
import type { Location } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LocationGridProps {
  locations: Location[]
  onDelete: (id: string) => void
  onEdit: (location: Location) => void
  onToggleFavorite: (id: string, favorite: boolean) => void
  viewMode: "grid" | "list"
  showNetherConversion: boolean
}

export function LocationGrid({ locations, onDelete, onEdit, onToggleFavorite, viewMode, showNetherConversion }: LocationGridProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null)

  const gridLocations = locations.filter((loc) => loc.type !== "screenshot")

  const handleDeleteClick = (location: Location) => {
    setLocationToDelete(location)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      onDelete(locationToDelete.id)
    }
    setDeleteDialogOpen(false)
    setLocationToDelete(null)
  }

  if (gridLocations.length === 0) {
    return (
      <div className="border border-dashed border-border/50 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 border border-primary/30 flex items-center justify-center">
          <span className="text-4xl font-mono text-primary/50">0</span>
        </div>
        <p className="text-muted-foreground font-mono text-sm">NO HAY UBICACIONES</p>
        <p className="text-muted-foreground/50 text-xs mt-1">Añade tu primera ubicación para empezar</p>
      </div>
    )
  }

  return (
    <>
      {viewMode === "list" ? (
        <div className="border border-border/50 divide-y divide-border/30">
          {gridLocations.map((location) => (
            <LocationListItem
              key={location.id}
              location={location}
              onDelete={() => handleDeleteClick(location)}
              onEdit={() => onEdit(location)}
              onToggleFavorite={() => onToggleFavorite(location.id, !location.favorite)}
              showNetherConversion={showNetherConversion}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onDelete={() => handleDeleteClick(location)}
              onEdit={() => onEdit(location)}
              onToggleFavorite={() => onToggleFavorite(location.id, !location.favorite)}
              showNetherConversion={showNetherConversion}
            />
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">ELIMINAR UBICACIÓN</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar{" "}
              <span className="text-foreground font-bold">{locationToDelete?.name}</span>? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">CANCELAR</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 font-mono text-xs"
            >
              ELIMINAR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function LocationListItem({
  location,
  onDelete,
  onEdit,
  onToggleFavorite,
  showNetherConversion,
}: {
  location: Location
  onDelete: () => void
  onEdit: () => void
  onToggleFavorite: () => void
  showNetherConversion: boolean
}) {
  const dimensionColor = getDimensionColor(location.dimension)
  const showNether = showNetherConversion && location.dimension === "overworld"
  const netherCoords = showNether ? overworldToNether({ x: location.x, y: location.y, z: location.z }) : null

  return (
    <div className="flex items-center gap-4 p-4 bg-card/30 hover:bg-card/50 transition-colors">
      <div className={`w-10 h-10 border flex items-center justify-center shrink-0 ${dimensionColor}`}>
        {getLocationIcon(location.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground truncate">{location.name}</h3>
          {location.favorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground bg-muted/30 px-1.5 py-0.5">
            {getTypeLabel(location.type)}
          </span>
          <span className={`text-[10px] font-mono tracking-widest ${dimensionColor.split(" ")[0]}`}>
            {getDimensionLabel(location.dimension)}
          </span>
        </div>
        {location.description && <p className="text-sm text-muted-foreground truncate">{location.description}</p>}
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 font-mono text-sm">
            <span>
              <span className="text-red-400">X</span> {location.x}
            </span>
            <span>
              <span className="text-green-400">Y</span> {location.y}
            </span>
            <span>
              <span className="text-blue-400">Z</span> {location.z}
            </span>
          </div>
          {netherCoords && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-red-400/70">
              <ArrowRightLeft className="w-3 h-3" />
              <span>NETHER: {netherCoords.x}, {netherCoords.y}, {netherCoords.z}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={`h-8 w-8 ${location.favorite ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`}
          >
            <Star className={`w-4 h-4 ${location.favorite ? "fill-yellow-400" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function LocationCard({
  location,
  onDelete,
  onEdit,
  onToggleFavorite,
  showNetherConversion,
}: {
  location: Location
  onDelete: () => void
  onEdit: () => void
  onToggleFavorite: () => void
  showNetherConversion: boolean
}) {
  const dimensionColor = getDimensionColor(location.dimension)
  const showNether = showNetherConversion && location.dimension === "overworld"
  const netherCoords = showNether ? overworldToNether({ x: location.x, y: location.y, z: location.z }) : null

  return (
    <div className="group relative border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border flex items-center justify-center ${dimensionColor}`}>
              {getLocationIcon(location.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground leading-tight">{location.name}</h3>
                {location.favorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground bg-muted/30 px-1.5 py-0.5">
                  {getTypeLabel(location.type)}
                </span>
                <span className={`text-[10px] font-mono tracking-widest ${dimensionColor.split(" ")[0]}`}>
                  {getDimensionLabel(location.dimension)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="bg-background/50 border border-border/30 p-3 mb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <CoordDisplay label="X" value={location.x} color="text-red-400" />
            <CoordDisplay label="Y" value={location.y} color="text-green-400" />
            <CoordDisplay label="Z" value={location.z} color="text-blue-400" />
          </div>
          {netherCoords && (
            <div className="mt-2 pt-2 border-t border-border/20 flex items-center justify-center gap-2 font-mono text-[10px] text-red-400/70">
              <ArrowRightLeft className="w-3 h-3" />
              <span>NETHER: {netherCoords.x}, {netherCoords.y}, {netherCoords.z}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{location.description}</p>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={`h-9 w-9 ${location.favorite ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`}
          >
            <Star className={`w-4 h-4 ${location.favorite ? "fill-yellow-400" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 text-xs font-mono gap-2 h-9 bg-transparent"
          >
            <Pencil className="w-3 h-3" />
            EDITAR
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-border/30 bg-background/50" />
    </div>
  )
}

function CoordDisplay({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <span className={`text-[10px] font-mono ${color} block`}>{label}</span>
      <span className="font-mono font-bold text-foreground">{value}</span>
    </div>
  )
}
