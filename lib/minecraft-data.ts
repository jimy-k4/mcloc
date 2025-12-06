// All Minecraft biomes organized by dimension
export const BIOMES = {
  overworld: [
    "Ocean",
    "Deep Ocean",
    "Warm Ocean",
    "Lukewarm Ocean",
    "Deep Lukewarm Ocean",
    "Cold Ocean",
    "Deep Cold Ocean",
    "Frozen Ocean",
    "Deep Frozen Ocean",
    "Mushroom Fields",
    "Jagged Peaks",
    "Frozen Peaks",
    "Stony Peaks",
    "Meadow",
    "Cherry Grove",
    "Grove",
    "Snowy Slopes",
    "Windswept Hills",
    "Windswept Gravelly Hills",
    "Windswept Forest",
    "Forest",
    "Flower Forest",
    "Taiga",
    "Old Growth Pine Taiga",
    "Old Growth Spruce Taiga",
    "Snowy Taiga",
    "Birch Forest",
    "Old Growth Birch Forest",
    "Dark Forest",
    "Pale Garden",
    "Jungle",
    "Sparse Jungle",
    "Bamboo Jungle",
    "River",
    "Frozen River",
    "Swamp",
    "Mangrove Swamp",
    "Beach",
    "Snowy Beach",
    "Stony Shore",
    "Plains",
    "Sunflower Plains",
    "Snowy Plains",
    "Ice Spikes",
    "Desert",
    "Savanna",
    "Savanna Plateau",
    "Windswept Savanna",
  ],
  nether: ["Nether Wastes", "Crimson Forest", "Warped Forest", "Soul Sand Valley", "Basalt Deltas"],
  end: ["The End", "End Highlands", "End Midlands", "End Barrens", "Small End Islands"],
}

// All Minecraft structures organized by dimension
export const STRUCTURES = {
  overworld: [
    "Ancient City",
    "Mineshaft",
    "Stronghold",
    "Buried Treasure",
    "Trail Ruins",
    "Trial Chambers",
    "Desert Pyramid",
    "Igloo",
    "Jungle Temple",
    "Pillager Outpost",
    "Swamp Hut",
    "Village",
    "Abandoned Village",
    "Woodland Mansion",
    "Ruined Portal",
    "Ocean Ruins",
    "Shipwreck",
    "Ocean Monument",
  ],
  nether: ["Nether Fortress", "Bastion Remnant", "Nether Fossil", "Ruined Portal"],
  end: ["End City"],
}

export type Dimension = "overworld" | "nether" | "end"

export function getBiomesByDimension(dimension: Dimension): string[] {
  return BIOMES[dimension] || []
}

export function getStructuresByDimension(dimension: Dimension): string[] {
  return STRUCTURES[dimension] || []
}
