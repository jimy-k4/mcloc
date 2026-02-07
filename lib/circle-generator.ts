export interface BlockCoord {
  x: number
  z: number
}

/**
 * Generate a filled circle of blocks
 */
export function generateFilledCircle(radius: number): BlockCoord[] {
  const blocks: BlockCoord[] = []
  const r = radius

  for (let x = -r; x <= r; x++) {
    for (let z = -r; z <= r; z++) {
      if (x * x + z * z <= r * r) {
        blocks.push({ x, z })
      }
    }
  }

  return blocks
}

/**
 * Generate a circle outline of blocks
 */
export function generateCircleOutline(
  radius: number,
  thickness: number = 1
): BlockCoord[] {
  const blocks: BlockCoord[] = []
  const outerR = radius
  const innerR = Math.max(0, radius - thickness)

  for (let x = -outerR; x <= outerR; x++) {
    for (let z = -outerR; z <= outerR; z++) {
      const distSq = x * x + z * z
      if (distSq <= outerR * outerR && distSq >= innerR * innerR) {
        blocks.push({ x, z })
      }
    }
  }

  return blocks
}

/**
 * Generate a pixel grid representation (2D boolean array)
 */
export function generatePixelGrid(
  radius: number,
  thickness: number,
  filled: boolean
): boolean[][] {
  const size = radius * 2 + 1
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  )

  const blocks = filled
    ? generateFilledCircle(radius)
    : generateCircleOutline(radius, thickness)

  for (const block of blocks) {
    const gx = block.x + radius
    const gz = block.z + radius
    if (gx >= 0 && gx < size && gz >= 0 && gz < size) {
      grid[gz][gx] = true
    }
  }

  return grid
}
