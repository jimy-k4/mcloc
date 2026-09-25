"use client"

import { useState, useMemo } from "react"
import { Circle, Copy, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generatePixelGrid, generateFilledCircle, generateCircleOutline } from "@/lib/circle-generator"

export function CircleGenerator() {
  const [radius, setRadius] = useState(8)
  const [thickness, setThickness] = useState(1)
  const [filled, setFilled] = useState(false)
  const [copied, setCopied] = useState(false)

  const grid = useMemo(() => generatePixelGrid(radius, thickness, filled), [radius, thickness, filled])
  const blocks = useMemo(
    () => (filled ? generateFilledCircle(radius) : generateCircleOutline(radius, thickness)),
    [radius, thickness, filled],
  )

  const cellSize = Math.max(2, Math.min(16, Math.floor(400 / (radius * 2 + 1))))

  const handleCopy = async () => {
    const text = blocks.map((b) => `(${b.x}, ${b.z})`).join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Radius */}
        <div className="bg-card/50 border border-border/50 p-4">
          <label className="text-xs font-mono text-muted-foreground block mb-2">RADIO</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent"
              onClick={() => setRadius((r) => Math.max(1, r - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={64}
              value={radius}
              onChange={(e) => setRadius(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
              className="h-10 text-center font-mono text-lg bg-background border-border/50"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent"
              onClick={() => setRadius((r) => Math.min(64, r + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Thickness (only for outline) */}
        <div className={`bg-card/50 border border-border/50 p-4 ${filled ? "opacity-50 pointer-events-none" : ""}`}>
          <label className="text-xs font-mono text-muted-foreground block mb-2">GROSOR</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent"
              onClick={() => setThickness((t) => Math.max(1, t - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={radius}
              value={thickness}
              onChange={(e) => setThickness(Math.max(1, Math.min(radius, Number(e.target.value) || 1)))}
              className="h-10 text-center font-mono text-lg bg-background border-border/50"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent"
              onClick={() => setThickness((t) => Math.min(radius, t + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="bg-card/50 border border-border/50 p-4">
          <label className="text-xs font-mono text-muted-foreground block mb-2">MODO</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFilled(false)}
              className={`p-2 text-xs font-mono border transition-all ${
                !filled
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background border-border/50 text-muted-foreground"
              }`}
            >
              CONTORNO
            </button>
            <button
              onClick={() => setFilled(true)}
              className={`p-2 text-xs font-mono border transition-all ${
                filled
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background border-border/50 text-muted-foreground"
              }`}
            >
              RELLENO
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-card/30 border border-border/50 px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              BLOQUES: <span className="text-foreground font-bold">{blocks.length}</span>
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            DIAMETRO: <span className="text-foreground font-bold">{radius * 2 + 1}</span>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs gap-2 bg-transparent"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "COPIADO" : "COPIAR COORDS"}
        </Button>
      </div>

      {/* Pixel grid preview */}
      <div className="border border-border/50 bg-background/50 p-4 overflow-auto">
        <div
          className="mx-auto"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${radius * 2 + 1}, ${cellSize}px)`,
            gap: "1px",
            width: "fit-content",
          }}
        >
          {grid.map((row, z) =>
            row.map((active, x) => (
              <div
                key={`${x}-${z}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                }}
                className={`
                  transition-colors
                  ${active ? "bg-primary" : "bg-card/30"}
                  ${x === radius && z === radius ? "ring-1 ring-accent" : ""}
                `}
              />
            )),
          )}
        </div>
      </div>

      {/* Coordinate list */}
      <details className="border border-border/50">
        <summary className="px-4 py-3 font-mono text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          VER COORDENADAS RELATIVAS ({blocks.length} bloques)
        </summary>
        <div className="px-4 pb-4 max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 font-mono text-[10px]">
            {blocks.map((b, i) => (
              <span key={`${b.x}-${b.z}-${i}`} className="text-muted-foreground bg-card/30 px-1.5 py-0.5 text-center">
                {b.x},{b.z}
              </span>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}
