"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { ZoomIn, ZoomOut, Maximize2, Move, Crosshair, MapPinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLocationIcon } from "@/lib/location-config"
import type { Location, Dimension } from "@/lib/types"

interface CoordinateMapProps {
  locations: Location[]
  activeDimension: Dimension
}

export function CoordinateMap({ locations, activeDimension }: CoordinateMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const filteredLocations = useMemo(
    () => locations.filter((loc) => loc.dimension === activeDimension && loc.type !== "screenshot"),
    [locations, activeDimension],
  )

  const bounds = useMemo(() => {
    if (filteredLocations.length === 0) {
      return { minX: -500, maxX: 500, minZ: -500, maxZ: 500, centerX: 0, centerZ: 0 }
    }

    const xs = filteredLocations.map((l) => l.x)
    const zs = filteredLocations.map((l) => l.z)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minZ = Math.min(...zs)
    const maxZ = Math.max(...zs)
    const padding = Math.max((maxX - minX) * 0.2, (maxZ - minZ) * 0.2, 100)

    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minZ: minZ - padding,
      maxZ: maxZ + padding,
      centerX: (minX + maxX) / 2,
      centerZ: (minZ + maxZ) / 2,
    }
  }, [filteredLocations])

  const worldToCanvas = useCallback(
    (worldX: number, worldZ: number, canvasWidth: number, canvasHeight: number) => {
      const rangeX = bounds.maxX - bounds.minX
      const rangeZ = bounds.maxZ - bounds.minZ
      const scale = Math.min(canvasWidth / rangeX, canvasHeight / rangeZ) * zoom

      const x = (worldX - bounds.centerX) * scale + canvasWidth / 2 + offset.x
      const y = (worldZ - bounds.centerZ) * scale + canvasHeight / 2 + offset.y

      return { x, y, scale }
    },
    [bounds, zoom, offset],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid
    const gridSpacing = 100
    const { scale } = worldToCanvas(0, 0, canvas.width, canvas.height)
    const adjustedSpacing = gridSpacing * scale

    ctx.strokeStyle = "rgba(34, 197, 94, 0.1)"
    ctx.lineWidth = 1

    const startX = ((offset.x + canvas.width / 2) % adjustedSpacing) - adjustedSpacing
    const startY = ((offset.y + canvas.height / 2) % adjustedSpacing) - adjustedSpacing

    for (let x = startX; x < canvas.width + adjustedSpacing; x += adjustedSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = startY; y < canvas.height + adjustedSpacing; y += adjustedSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Origin crosshair
    const origin = worldToCanvas(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "rgba(34, 197, 94, 0.3)"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(origin.x, 0)
    ctx.lineTo(origin.x, canvas.height)
    ctx.moveTo(0, origin.y)
    ctx.lineTo(canvas.width, origin.y)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw location points
    filteredLocations.forEach((loc) => {
      const pos = worldToCanvas(loc.x, loc.z, canvas.width, canvas.height)
      const isHovered = hoveredLocation?.id === loc.id
      const radius = isHovered ? 14 : 10

      // Glow effect
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2)
      let color = "34, 197, 94" // default green
      if (loc.color) {
        // Convert hex to RGB
        const hex = loc.color.replace("#", "")
        const r = Number.parseInt(hex.substring(0, 2), 16)
        const g = Number.parseInt(hex.substring(2, 4), 16)
        const b = Number.parseInt(hex.substring(4, 6), 16)
        color = `${r}, ${g}, ${b}`
      } else {
        // Use dimension default colors
        color =
          loc.dimension === "overworld" ? "34, 197, 94" : loc.dimension === "nether" ? "239, 68, 68" : "168, 85, 247"
      }

      gradient.addColorStop(0, `rgba(${color}, 0.6)`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Point
      ctx.fillStyle = `rgba(${color}, 1)`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = isHovered ? "#ffffff" : `rgba(${color}, 0.8)`
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()

      // Label
      if (zoom > 0.5 || isHovered) {
        ctx.fillStyle = "#ffffff"
        ctx.font = `${isHovered ? "bold " : ""}11px "JetBrains Mono", monospace`
        ctx.textAlign = "center"
        ctx.fillText(loc.name, pos.x, pos.y - radius - 8)

        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.fillText(`${loc.x}, ${loc.z}`, pos.x, pos.y - radius - 20)
      }
    })
  }, [filteredLocations, zoom, offset, hoveredLocation, worldToCanvas])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    setMousePos({ x: mouseX, y: mouseY })

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else {
      // Check hover
      let found: Location | null = null
      for (const loc of filteredLocations) {
        const pos = worldToCanvas(loc.x, loc.z, canvas.width, canvas.height)
        const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2)
        if (dist < 15) {
          found = loc
          break
        }
      }
      setHoveredLocation(found)
    }
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => {
    setIsDragging(false)
    setHoveredLocation(null)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((prev) => Math.max(0.1, Math.min(5, prev * delta)))
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="border border-border/50 bg-card/30 overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border/30 bg-background/50">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">MAPA DE COORDENADAS</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(5, z * 1.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom((z) => Math.max(0.1, z * 0.8))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="relative h-[400px] cursor-move">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full"
        />

        {filteredLocations.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border border-dashed border-border/50 flex items-center justify-center mb-4">
              <MapPinOff className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              SIN UBICACIONES EN {activeDimension.toUpperCase()}
            </p>
            <p className="font-mono text-xs text-muted-foreground/50 mt-1">Añade ubicaciones para verlas en el mapa</p>
          </div>
        )}

        {/* Hover tooltip */}
        {hoveredLocation && (
          <div
            className="absolute pointer-events-none bg-background/95 border border-primary/50 p-3 z-10"
            style={{
              left: Math.min(mousePos.x + 15, containerRef.current?.clientWidth! - 200),
              top: Math.min(mousePos.y + 15, containerRef.current?.clientHeight! - 100),
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-6 h-6 flex items-center justify-center ${
                  hoveredLocation.color ? `bg-${hoveredLocation.color}` : "bg-green-500"
                }`}
              >
                {getLocationIcon(hoveredLocation.type, "w-4 h-4")}
              </div>
              <span className="font-bold text-sm">{hoveredLocation.name}</span>
            </div>
            <div className="font-mono text-xs space-y-1">
              <div className="flex gap-4">
                <span>
                  <span className="text-red-400">X</span> {hoveredLocation.x}
                </span>
                <span>
                  <span className="text-green-400">Y</span> {hoveredLocation.y}
                </span>
                <span>
                  <span className="text-blue-400">Z</span> {hoveredLocation.z}
                </span>
              </div>
            </div>
            {hoveredLocation.description && (
              <p className="text-xs text-muted-foreground mt-2 max-w-[180px]">{hoveredLocation.description}</p>
            )}
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2 py-1 bg-background/80 border border-border/30">
          <Move className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Location count */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-background/80 border border-border/30">
          <span className="font-mono text-[10px] text-primary">{filteredLocations.length} PUNTOS</span>
        </div>
      </div>
    </div>
  )
}
