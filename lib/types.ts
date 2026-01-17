export type LocationType =
  | "base"
  | "portal"
  | "spawner"
  | "village"
  | "structure"
  | "biome"
  | "cave"
  | "resource"
  | "screenshot"

export type Dimension = "overworld" | "nether" | "end"

export interface Location {
  id: string
  name: string
  type: LocationType
  x: number
  y: number
  z: number
  dimension: Dimension
  world_id: string
  description?: string | null
  screenshot_url?: string | null
  created_at: string
  favorite: boolean
  color?: string | null
}

export interface World {
  id: string
  name: string
  created_at: string
}

// Database row types
export interface DbLocation {
  id: string
  name: string
  type: string
  x: number
  y: number
  z: number
  dimension: string
  world_id: string
  description: string | null
  screenshot_url: string | null
  created_at: string
  favorite: boolean
  color: string | null
}

export interface DbWorld {
  id: string
  name: string
  created_at: string
}
