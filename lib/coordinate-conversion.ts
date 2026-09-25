import type { Dimension } from "./types"

export interface Coords {
  x: number
  y: number
  z: number
}

/**
 * Convert Overworld coordinates to Nether equivalent
 * X and Z are divided by 8, Y stays the same
 */
export function overworldToNether(coords: Coords): Coords {
  return {
    x: Math.round(coords.x / 8),
    y: coords.y,
    z: Math.round(coords.z / 8),
  }
}

/**
 * Convert Nether coordinates to Overworld equivalent
 * X and Z are multiplied by 8, Y stays the same
 */
export function netherToOverworld(coords: Coords): Coords {
  return {
    x: coords.x * 8,
    y: coords.y,
    z: coords.z * 8,
  }
}

/**
 * Convert coordinates between dimensions
 */
export function convertCoords(
  coords: Coords,
  from: Dimension,
  to: Dimension
): Coords | null {
  if (from === to) return coords
  if (from === "end" || to === "end") return null // No conversion for End

  if (from === "overworld" && to === "nether") return overworldToNether(coords)
  if (from === "nether" && to === "overworld") return netherToOverworld(coords)

  return null
}

/**
 * Format coordinates as a readable string
 */
export function formatCoords(coords: Coords): string {
  return `X: ${coords.x} Y: ${coords.y} Z: ${coords.z}`
}
