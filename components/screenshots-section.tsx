"use client"

import { Camera, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getDimensionColor, getDimensionLabel } from "@/lib/location-config"
import type { Location } from "@/lib/types"

interface ScreenshotsSectionProps {
  screenshots: Location[]
  onDelete: (id: string) => void
}

export function ScreenshotsSection({ screenshots, onDelete }: ScreenshotsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (screenshots.length === 0) return null

  return (
    <div className="border border-accent/30 bg-accent/5 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-accent/50 bg-accent/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-foreground">CAPTURAS GUARDADAS</h3>
            <p className="text-xs font-mono text-muted-foreground">{screenshots.length} capturas de zonas</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-accent/20 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="group relative border border-border/50 bg-card/50 overflow-hidden">
                {screenshot.screenshot_url && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={screenshot.screenshot_url || "/placeholder.svg"}
                      alt={screenshot.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1">{screenshot.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-mono ${getDimensionColor(screenshot.dimension).split(" ")[0]}`}>
                      {getDimensionLabel(screenshot.dimension)}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {screenshot.x}, {screenshot.y}, {screenshot.z}
                    </span>
                  </div>
                  {screenshot.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{screenshot.description}</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(screenshot.id)}
                    className="mt-2 h-7 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
