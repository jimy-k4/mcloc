"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Upload, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LOCATION_TYPES, DIMENSIONS, getLocationIcon, getDimensionIcon } from "@/lib/location-config"
import type { Location, LocationType, Dimension } from "@/lib/types"

interface AddLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (location: Omit<Location, "id" | "created_at">) => void
  onEdit?: (location: Location) => void
  editingLocation?: Location | null
  activeWorld: string
}

export function AddLocationModal({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingLocation,
  activeWorld,
}: AddLocationModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<LocationType>("base")
  const [dimension, setDimension] = useState<Dimension>("overworld")
  const [x, setX] = useState("")
  const [y, setY] = useState("")
  const [z, setZ] = useState("")
  const [description, setDescription] = useState("")
  const [screenshot, setScreenshot] = useState("")

  useEffect(() => {
    if (editingLocation) {
      setName(editingLocation.name)
      setType(editingLocation.type)
      setDimension(editingLocation.dimension)
      setX(editingLocation.x.toString())
      setY(editingLocation.y.toString())
      setZ(editingLocation.z.toString())
      setDescription(editingLocation.description || "")
      setScreenshot(editingLocation.screenshot_url || "")
    } else {
      resetForm()
    }
  }, [editingLocation])

  const resetForm = () => {
    setName("")
    setType("base")
    setDimension("overworld")
    setX("")
    setY("")
    setZ("")
    setDescription("")
    setScreenshot("")
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const locationData = {
      name,
      type,
      dimension,
      x: Number.parseInt(x) || 0,
      y: Number.parseInt(y) || 0,
      z: Number.parseInt(z) || 0,
      description,
      world_id: activeWorld,
      screenshot_url: type === "screenshot" ? screenshot : undefined,
    }

    if (editingLocation && onEdit) {
      onEdit({
        ...locationData,
        id: editingLocation.id,
        created_at: editingLocation.created_at,
      })
    } else {
      onAdd(locationData)
    }

    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isEditing = !!editingLocation

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{isEditing ? "EDITAR UBICACIÓN" : "NUEVA UBICACIÓN"}</h2>
              <p className="text-xs font-mono text-muted-foreground">
                {isEditing ? "Modifica los datos" : "Registra un nuevo punto"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Name */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">NOMBRE DE LA UBICACIÓN</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Base Principal"
              className="h-12 font-mono bg-background border-border/50"
              required
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">TIPO DE UBICACIÓN</label>
            <div className="grid grid-cols-4 gap-2">
              {LOCATION_TYPES.map((locType) => (
                <button
                  key={locType.value}
                  type="button"
                  onClick={() => setType(locType.value)}
                  className={`
                    p-3 border flex flex-col items-center gap-2 transition-all
                    ${
                      type === locType.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border/50 text-muted-foreground hover:border-primary/50"
                    }
                  `}
                >
                  {getLocationIcon(locType.value)}
                  <span className="text-[9px] font-mono">{locType.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Selection */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">DIMENSIÓN</label>
            <div className="grid grid-cols-3 gap-2">
              {DIMENSIONS.map((dim) => (
                <button
                  key={dim.value}
                  type="button"
                  onClick={() => setDimension(dim.value)}
                  className={`
                    p-4 border flex flex-col items-center gap-2 transition-all
                    ${
                      dimension === dim.value
                        ? `${dim.bgColor} ${dim.borderColor} ${dim.textColor}`
                        : "bg-background border-border/50 text-muted-foreground hover:border-primary/50"
                    }
                  `}
                >
                  {getDimensionIcon(dim.value)}
                  <span className="text-[10px] font-mono">{dim.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">COORDENADAS</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-center text-xs font-mono text-red-400 mb-1">X</div>
                <Input
                  type="number"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  placeholder="0"
                  className="h-12 text-center font-mono bg-background border-border/50"
                  required
                />
              </div>
              <div>
                <div className="text-center text-xs font-mono text-green-400 mb-1">Y</div>
                <Input
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  placeholder="64"
                  className="h-12 text-center font-mono bg-background border-border/50"
                  required
                />
              </div>
              <div>
                <div className="text-center text-xs font-mono text-blue-400 mb-1">Z</div>
                <Input
                  type="number"
                  value={z}
                  onChange={(e) => setZ(e.target.value)}
                  placeholder="0"
                  className="h-12 text-center font-mono bg-background border-border/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Screenshot URL (only for screenshot type) */}
          {type === "screenshot" && (
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-2 block">URL DE LA CAPTURA</label>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="url"
                  value={screenshot}
                  onChange={(e) => setScreenshot(e.target.value)}
                  placeholder="https://..."
                  className="pl-12 h-12 font-mono bg-background border-border/50"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Sube tu captura a un servicio de imágenes y pega la URL
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">DESCRIPCIÓN (OPCIONAL)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas sobre esta ubicación..."
              className="min-h-[80px] font-mono bg-background border-border/50 resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg tracking-wide"
          >
            {isEditing ? "GUARDAR CAMBIOS" : "GUARDAR UBICACIÓN"}
          </Button>
        </form>
      </div>
    </div>
  )
}
