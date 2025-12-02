"use client"

import { ChevronDown, Globe, Plus } from "lucide-react"
import { useState } from "react"
import type { World } from "@/lib/types"

interface WorldSelectorProps {
  worlds: World[]
  activeWorld: string
  onWorldChange: (worldId: string) => void
  onAddWorld: (name: string) => void
}

export function WorldSelector({ worlds, activeWorld, onWorldChange, onAddWorld }: WorldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newWorldName, setNewWorldName] = useState("")

  const currentWorld = worlds.find((w) => w.id === activeWorld)

  const handleAddWorld = () => {
    if (newWorldName.trim()) {
      onAddWorld(newWorldName.trim())
      setNewWorldName("")
      setIsAdding(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card/50 border border-border/50 hover:border-primary/50 transition-all"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm">{currentWorld?.name || "Sin mundo"}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border/50 z-50 shadow-xl">
            <div className="p-2 border-b border-border/30">
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest">MUNDOS GUARDADOS</span>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {worlds.map((world) => (
                <button
                  key={world.id}
                  onClick={() => {
                    onWorldChange(world.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    activeWorld === world.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "hover:bg-card text-foreground"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-mono text-sm">{world.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-border/30 p-2">
              {isAdding ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWorldName}
                    onChange={(e) => setNewWorldName(e.target.value)}
                    placeholder="Nombre del mundo..."
                    className="flex-1 px-3 py-2 bg-background border border-border/50 font-mono text-sm focus:outline-none focus:border-primary"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleAddWorld()}
                  />
                  <button
                    onClick={handleAddWorld}
                    className="px-3 py-2 bg-primary text-primary-foreground text-xs font-mono"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-mono text-xs">AÑADIR MUNDO</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
