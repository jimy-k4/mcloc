import type { Coords } from "./coordinate-conversion"

// Movement speeds in blocks per second
const WALKING_SPEED = 4.3
const SPRINTING_SPEED = 5.6
const ELYTRA_SPEED = 40

/**
 * Euclidean distance on X/Z plane (horizontal)
 */
export function horizontalDistance(a: Coords, b: Coords): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
}

/**
 * Full 3D Euclidean distance
 */
export function distance3D(a: Coords, b: Coords): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

/**
 * Format distance to a human-readable string
 */
export function formatDistance(blocks: number): string {
  if (blocks >= 1000) {
    return `${(blocks / 1000).toFixed(1)}K`
  }
  return `${Math.round(blocks)}`
}

/**
 * Estimate travel time in seconds
 */
export function estimateTravelTime(
  blocks: number,
  mode: "walking" | "sprinting" | "elytra"
): number {
  const speed =
    mode === "walking"
      ? WALKING_SPEED
      : mode === "sprinting"
        ? SPRINTING_SPEED
        : ELYTRA_SPEED
  return blocks / speed
}

/**
 * Format seconds to a readable time string
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60)
    const sec = Math.round(seconds % 60)
    return `${min}m ${sec}s`
  }
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${min}m`
}
