"use client"

import { MapPin, Plus, Blocks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorldSelector } from "@/components/world-selector"
import type { World } from "@/lib/types"

interface HeaderProps {
  onAddClick: () => void
  worlds: World[]
  activeWorld: string
  onWorldChange: (worldId: string) => void
  onAddWorld: (name: string) => void
}

export function Header({ onAddClick, worlds, activeWorld, onWorldChange, onAddWorld }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 border border-primary/50 flex items-center justify-center glow-primary">
                <Blocks className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">
                <span className="text-primary">MC</span>
                <span className="text-foreground">LOC</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                World Tracker v1.0
              </p>
            </div>
          </div>

          <WorldSelector
            worlds={worlds}
            activeWorld={activeWorld}
            onWorldChange={onWorldChange}
            onAddWorld={onAddWorld}
          />

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Status indicators */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">SYNC</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono text-muted-foreground">LOCAL</span>
              </div>
            </div>

            {/* Add button */}
            <Button
              onClick={onAddClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide gap-2 h-12 px-6"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">NUEVA UBICACIÓN</span>
              <span className="sm:hidden">AÑADIR</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
