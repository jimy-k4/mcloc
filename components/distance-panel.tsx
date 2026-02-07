"use client"

import { Ruler, Footprints, Zap, ArrowRightLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { horizontalDistance, estimateTravelTime, formatTime, formatDistance } from "@/lib/distance"
import { overworldToNether } from "@/lib/coordinate-conversion"
import type { Location } from "@/lib/types"

interface DistancePanelProps {
  locationA: Location
  locationB: Location
  onClose: () => void
}

export function DistancePanel({ locationA, locationB, onClose }: DistancePanelProps) {
  const coordsA = { x: locationA.x, y: locationA.y, z: locationA.z }
  const coordsB = { x: locationB.x, y: locationB.y, z: locationB.z }

  const dist = horizontalDistance(coordsA, coordsB)
  const netherDist = dist / 8

  const walkTime = estimateTravelTime(dist, "walking")
  const sprintTime = estimateTravelTime(dist, "sprinting")
  const elytraTime = estimateTravelTime(dist, "elytra")
  const netherWalkTime = estimateTravelTime(netherDist, "walking")

  return (
    <div className="border border-accent/50 bg-card/90 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-accent" />
          <span className="font-mono text-xs text-accent tracking-wider">DISTANCIA</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Locations */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-foreground font-bold truncate max-w-[120px]">{locationA.name}</span>
        <ArrowRightLeft className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-foreground font-bold truncate max-w-[120px]">{locationB.name}</span>
      </div>

      {/* Distances */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background/50 border border-border/30 p-2">
          <div className="text-[9px] font-mono text-muted-foreground">OVERWORLD</div>
          <div className="text-lg font-bold font-mono text-primary">{formatDistance(dist)}<span className="text-xs text-muted-foreground ml-0.5">b</span></div>
        </div>
        <div className="bg-background/50 border border-border/30 p-2">
          <div className="text-[9px] font-mono text-red-400">NETHER EQ.</div>
          <div className="text-lg font-bold font-mono text-red-400">{formatDistance(netherDist)}<span className="text-xs text-muted-foreground ml-0.5">b</span></div>
        </div>
      </div>

      {/* Travel times */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Footprints className="w-3 h-3" /> Andando
          </span>
          <span className="text-foreground">{formatTime(walkTime)}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Footprints className="w-3 h-3" /> Sprinting
          </span>
          <span className="text-foreground">{formatTime(sprintTime)}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3 h-3" /> Elytra
          </span>
          <span className="text-foreground">{formatTime(elytraTime)}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono border-t border-border/30 pt-1.5">
          <span className="flex items-center gap-1.5 text-red-400/70">
            <Footprints className="w-3 h-3" /> Nether walk
          </span>
          <span className="text-red-400">{formatTime(netherWalkTime)}</span>
        </div>
      </div>
    </div>
  )
}
