"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  defaultColor?: string
  label?: string
}

export function ColorPicker({ value, onChange, defaultColor, label = "COLOR" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    { hex: "#22c55e", name: "Emerald" },
    { hex: "#ef4444", name: "Red" },
    { hex: "#a855f7", name: "Purple" },
    { hex: "#3b82f6", name: "Blue" },
    { hex: "#f59e0b", name: "Amber" },
    { hex: "#ec4899", name: "Pink" },
    { hex: "#10b981", name: "Green" },
    { hex: "#f97316", name: "Orange" },
    { hex: "#8b5cf6", name: "Violet" },
    { hex: "#06b6d4", name: "Cyan" },
    { hex: "#eab308", name: "Yellow" },
    { hex: "#64748b", name: "Slate" },
  ]

  const displayColor = value || defaultColor || "#22c55e"

  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground mb-2 block">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 justify-start gap-3 font-mono bg-background border-border/50"
          >
            <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: displayColor }} />
            <span className="flex-1 text-left">{value || "Por defecto"}</span>
            <Palette className="w-4 h-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-card border-border/50" align="start">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">COLORES PREDEFINIDOS</p>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => {
                      onChange(color.hex)
                      setIsOpen(false)
                    }}
                    className={`w-10 h-10 rounded border-2 transition-all hover:scale-110 ${
                      value === color.hex ? "border-white ring-2 ring-primary" : "border-border/50"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground">SELECTOR DE COLOR</p>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={displayColor}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-12 w-16 p-1 cursor-pointer bg-background border-border/50"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={defaultColor || "#22c55e"}
                  className="h-12 flex-1 font-mono text-sm bg-background border-border/50"
                />
              </div>
            </div>

            {value && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className="w-full h-10 gap-2 font-mono text-xs"
              >
                <X className="w-3 h-3" />
                Usar color por defecto
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
