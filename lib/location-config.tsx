import type React from "react"
import { Home, Disc, Skull, Users, Castle, Trees, Gem, Camera, Mountain, Flame, Moon } from "lucide-react"
import type { LocationType, Dimension } from "./types"

export const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: "base", label: "Base" },
  { value: "portal", label: "Portal" },
  { value: "spawner", label: "Spawner" },
  { value: "village", label: "Aldea" },
  { value: "structure", label: "Estructura" },
  { value: "biome", label: "Bioma" },
  { value: "resource", label: "Recurso" },
  { value: "screenshot", label: "Captura" },
]

export const DIMENSIONS: {
  value: Dimension
  label: string
  textColor: string
  bgColor: string
  borderColor: string
}[] = [
  {
    value: "overworld",
    label: "Overworld",
    textColor: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1",
  },
  {
    value: "nether",
    label: "Nether",
    textColor: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4",
  },
  {
    value: "end",
    label: "End",
    textColor: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5",
  },
]

export function getLocationIcon(type: LocationType, className = "w-5 h-5") {
  const icons: Record<LocationType, React.ReactNode> = {
    base: <Home className={className} />,
    portal: <Disc className={className} />,
    spawner: <Skull className={className} />,
    village: <Users className={className} />,
    structure: <Castle className={className} />,
    biome: <Trees className={className} />,
    resource: <Gem className={className} />,
    screenshot: <Camera className={className} />,
  }
  return icons[type]
}

export function getDimensionIcon(dimension: Dimension, className = "w-6 h-6") {
  const icons: Record<Dimension, React.ReactNode> = {
    overworld: <Mountain className={className} />,
    nether: <Flame className={className} />,
    end: <Moon className={className} />,
  }
  return icons[dimension]
}

export function getDimensionColor(dimension: Dimension): string {
  const colors: Record<Dimension, string> = {
    overworld: "text-chart-1 border-chart-1/30 bg-chart-1/10",
    nether: "text-chart-4 border-chart-4/30 bg-chart-4/10",
    end: "text-chart-5 border-chart-5/30 bg-chart-5/10",
  }
  return colors[dimension]
}

export function getDimensionLabel(dimension: Dimension): string {
  const labels: Record<Dimension, string> = {
    overworld: "OVERWORLD",
    nether: "NETHER",
    end: "THE END",
  }
  return labels[dimension]
}
