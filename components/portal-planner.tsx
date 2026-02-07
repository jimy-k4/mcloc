"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { Disc, ArrowRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { overworldToNether } from "@/lib/coordinate-conversion"
import type { Location } from "@/lib/types"

interface PortalPlannerProps {
  locations: Location[]
  onCreateNetherPortal?: (location: Omit<Location, "id" | "created_at">) => void
  activeWorld: string
}

interface PreviewMarker {
  overworldLoc: Location
  netherX: number
  netherZ: number
  netherY: number
}

function MiniMap({
  locations,
  dimension,
  hoveredOverworld,
  previewMarker,
  onHoverLocation,
  onClickLocation,
}: {
  locations: Location[]
  dimension: "overworld" | "nether"
  hoveredOverworld: Location | null
  previewMarker: PreviewMarker | null
  onHoverLocation: (loc: Location | null) => void
  onClickLocation: (loc: Location) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState<Location | null>(null)

  const dimLocations = useMemo(
    () => locations.filter((l) => l.dimension === dimension && l.type !== "screenshot"),
    [locations, dimension],
  )

  const allPoints = useMemo(() => {
    const pts = dimLocations.map((l) => ({ x: l.x, z: l.z }))
    if (previewMarker && dimension === "nether") {
      pts.push({ x: previewMarker.netherX, z: previewMarker.netherZ })
    }
    return pts
  }, [dimLocations, previewMarker, dimension])

  const bounds = useMemo(() => {
    if (allPoints.length === 0) {
      return { minX: -500, maxX: 500, minZ: -500, maxZ: 500, centerX: 0, centerZ: 0 }
    }
    const xs = allPoints.map((p) => p.x)
    const zs = allPoints.map((p) => p.z)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minZ = Math.min(...zs)
    const maxZ = Math.max(...zs)
    const padding = Math.max((maxX - minX) * 0.3, (maxZ - minZ) * 0.3, 100)
    return {
      minX: minX - padding, maxX: maxX + padding,
      minZ: minZ - padding, maxZ: maxZ + padding,
      centerX: (minX + maxX) / 2, centerZ: (minZ + maxZ) / 2,
    }
  }, [allPoints])

  const worldToCanvas = useCallback(
    (worldX: number, worldZ: number, w: number, h: number) => {
      const rangeX = bounds.maxX - bounds.minX
      const rangeZ = bounds.maxZ - bounds.minZ
      const scale = Math.min(w / rangeX, h / rangeZ) * zoom
      return {
        x: (worldX - bounds.centerX) * scale + w / 2 + offset.x,
        y: (worldZ - bounds.centerZ) * scale + h / 2 + offset.y,
        scale,
      }
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

    const isOverworld = dimension === "overworld"
    ctx.fillStyle = isOverworld ? "#060d06" : "#0d0606"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid
    const { scale } = worldToCanvas(0, 0, canvas.width, canvas.height)
    const gridColor = isOverworld ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    const spacing = 100 * scale
    const sx = ((offset.x + canvas.width / 2) % spacing) - spacing
    const sy = ((offset.y + canvas.height / 2) % spacing) - spacing
    for (let x = sx; x < canvas.width + spacing; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
    }
    for (let y = sy; y < canvas.height + spacing; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
    }

    // Origin
    const origin = worldToCanvas(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = isOverworld ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, canvas.height)
    ctx.moveTo(0, origin.y); ctx.lineTo(canvas.width, origin.y)
    ctx.stroke()
    ctx.setLineDash([])

    // Points
    const baseColor = isOverworld ? "34,197,94" : "239,68,68"
    dimLocations.forEach((loc) => {
      const pos = worldToCanvas(loc.x, loc.z, canvas.width, canvas.height)
      const isHov = hovered?.id === loc.id
      const r = isHov ? 10 : 7

      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2)
      const c = loc.color
        ? (() => {
            const hex = loc.color.replace("#", "")
            return `${Number.parseInt(hex.substring(0, 2), 16)},${Number.parseInt(hex.substring(2, 4), 16)},${Number.parseInt(hex.substring(4, 6), 16)}`
          })()
        : baseColor
      grad.addColorStop(0, `rgba(${c},0.5)`)
      grad.addColorStop(1, `rgba(${c},0)`)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = `rgba(${c},1)`
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = isHov ? "#fff" : `rgba(${c},0.7)`
      ctx.lineWidth = isHov ? 2 : 1
      ctx.stroke()

      if (zoom > 0.5 || isHov) {
        ctx.fillStyle = "#fff"
        ctx.font = `${isHov ? "bold " : ""}9px "JetBrains Mono", monospace`
        ctx.textAlign = "center"
        ctx.fillText(loc.name, pos.x, pos.y - r - 6)
      }
    })

    // Preview marker (nether side)
    if (previewMarker && dimension === "nether") {
      const pos = worldToCanvas(previewMarker.netherX, previewMarker.netherZ, canvas.width, canvas.height)
      const time = Date.now() / 500
      const pulseR = 8 + Math.sin(time) * 3

      ctx.setLineDash([6, 3])
      ctx.strokeStyle = "rgba(245,158,11,0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "rgba(245,158,11,0.3)"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#f59e0b"
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      ctx.textAlign = "center"
      ctx.fillText("PORTAL", pos.x, pos.y - 14)
      ctx.font = '8px "JetBrains Mono", monospace'
      ctx.fillStyle = "rgba(245,158,11,0.7)"
      ctx.fillText(`${previewMarker.netherX}, ${previewMarker.netherZ}`, pos.x, pos.y + 18)
    }

    // Highlight hovered overworld location with projection line (overworld side)
    if (hoveredOverworld && dimension === "overworld") {
      const pos = worldToCanvas(hoveredOverworld.x, hoveredOverworld.z, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(245,158,11,0.6)"
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [dimLocations, zoom, offset, hovered, worldToCanvas, dimension, previewMarker, hoveredOverworld])

  // Animate preview marker
  useEffect(() => {
    if (!previewMarker || dimension !== "nether") return
    const interval = setInterval(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const event = new Event("render")
        canvas.dispatchEvent(event)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [previewMarker, dimension])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (hovered && dimension === "overworld") {
      onClickLocation(hovered)
      return
    }
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    setMousePos({ x: mx, y: my })

    if (isDragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    } else {
      let found: Location | null = null
      for (const loc of dimLocations) {
        const pos = worldToCanvas(loc.x, loc.z, canvas.width, canvas.height)
        if (Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2) < 12) {
          found = loc
          break
        }
      }
      setHovered(found)
      if (dimension === "overworld") onHoverLocation(found)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setZoom((z) => Math.max(0.1, Math.min(5, z * (e.deltaY > 0 ? 0.9 : 1.1))))
    }
    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  const dimLabel = dimension === "overworld" ? "OVERWORLD" : "NETHER"
  const dimColor = dimension === "overworld" ? "text-emerald-400" : "text-red-400"

  return (
    <div className="border border-border/50 bg-card/30 flex-1 min-w-0">
      <div className="px-3 py-2 border-b border-border/30 bg-background/50 flex items-center gap-2">
        <span className={`font-mono text-xs font-bold ${dimColor}`}>{dimLabel}</span>
        {dimension === "overworld" && (
          <span className="text-[10px] font-mono text-muted-foreground">Click para proyectar portal</span>
        )}
      </div>
      <div
        ref={containerRef}
        className={`relative h-[350px] ${dimension === "overworld" ? "cursor-pointer" : "cursor-move"}`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => { setIsDragging(false); setHovered(null); onHoverLocation(null) }}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

export function PortalPlanner({ locations, onCreateNetherPortal, activeWorld }: PortalPlannerProps) {
  const [hoveredOverworld, setHoveredOverworld] = useState<Location | null>(null)
  const [previewMarker, setPreviewMarker] = useState<PreviewMarker | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleHoverOverworld = (loc: Location | null) => {
    setHoveredOverworld(loc)
    if (loc && !showConfirm) {
      const nether = overworldToNether({ x: loc.x, y: loc.y, z: loc.z })
      setPreviewMarker({
        overworldLoc: loc,
        netherX: nether.x,
        netherZ: nether.z,
        netherY: nether.y,
      })
    }
  }

  const handleClickOverworld = (loc: Location) => {
    const nether = overworldToNether({ x: loc.x, y: loc.y, z: loc.z })
    setPreviewMarker({
      overworldLoc: loc,
      netherX: nether.x,
      netherZ: nether.z,
      netherY: nether.y,
    })
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    if (previewMarker && onCreateNetherPortal) {
      onCreateNetherPortal({
        name: `Portal ${previewMarker.overworldLoc.name}`,
        type: "portal",
        x: previewMarker.netherX,
        y: previewMarker.netherY,
        z: previewMarker.netherZ,
        dimension: "nether",
        world_id: activeWorld,
        description: `Portal proyectado desde ${previewMarker.overworldLoc.name} (OW: ${previewMarker.overworldLoc.x}, ${previewMarker.overworldLoc.z})`,
        favorite: false,
        color: "#f59e0b",
      })
    }
    setShowConfirm(false)
    setPreviewMarker(null)
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setPreviewMarker(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 border border-primary/50 flex items-center justify-center">
          <Disc className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">PLANIFICADOR DE PORTALES</h2>
          <p className="text-xs font-mono text-muted-foreground">
            Haz click en una ubicacion del Overworld para proyectar su portal en el Nether
          </p>
        </div>
      </div>

      {/* Dual map */}
      <div className="flex gap-2">
        <MiniMap
          locations={locations}
          dimension="overworld"
          hoveredOverworld={hoveredOverworld}
          previewMarker={null}
          onHoverLocation={handleHoverOverworld}
          onClickLocation={handleClickOverworld}
        />
        <div className="flex items-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <MiniMap
          locations={locations}
          dimension="nether"
          hoveredOverworld={null}
          previewMarker={showConfirm ? previewMarker : (hoveredOverworld ? previewMarker : null)}
          onHoverLocation={() => {}}
          onClickLocation={() => {}}
        />
      </div>

      {/* Confirm bar */}
      {showConfirm && previewMarker && (
        <div className="bg-amber-500/10 border border-amber-500/50 p-4 flex items-center justify-between">
          <div className="font-mono text-sm">
            <span className="text-amber-400 font-bold">CREAR PORTAL</span>
            <span className="text-muted-foreground ml-2">
              {previewMarker.overworldLoc.name} (OW: {previewMarker.overworldLoc.x}, {previewMarker.overworldLoc.z})
            </span>
            <span className="text-red-400 ml-2">
              Nether: {previewMarker.netherX}, {previewMarker.netherZ}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="font-mono text-xs gap-1" onClick={handleCancel}>
              <X className="w-3 h-3" /> CANCELAR
            </Button>
            <Button size="sm" className="font-mono text-xs gap-1 bg-amber-500 hover:bg-amber-600 text-black" onClick={handleConfirm}>
              <Check className="w-3 h-3" /> CONFIRMAR
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
