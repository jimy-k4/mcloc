"use server"

import { createClient } from "@/lib/supabase/server"
import type { Location, World, DbLocation, DbWorld } from "@/lib/types"
import { revalidatePath } from "next/cache"

// World actions
export async function getWorlds(): Promise<World[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("worlds").select("*").order("created_at", { ascending: true })

  if (error) throw error
  return (data as DbWorld[]) || []
}

export async function createWorld(name: string): Promise<World> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("worlds").insert({ name }).select().single()

  if (error) throw error
  revalidatePath("/")
  return data as DbWorld
}

// Location actions
export async function getLocations(worldId: string): Promise<Location[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("world_id", worldId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as DbLocation[]).map(mapDbLocation) || []
}

export async function createLocation(location: Omit<Location, "id" | "created_at">): Promise<Location> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("locations")
    .insert({
      name: location.name,
      type: location.type,
      x: location.x,
      y: location.y,
      z: location.z,
      dimension: location.dimension,
      world_id: location.world_id,
      description: location.description || null,
      screenshot_url: location.screenshot_url || null,
      favorite: location.favorite || false,
      color: location.color || null,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/")
  return mapDbLocation(data as DbLocation)
}

export async function updateLocation(location: Location): Promise<Location> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("locations")
    .update({
      name: location.name,
      type: location.type,
      x: location.x,
      y: location.y,
      z: location.z,
      dimension: location.dimension,
      description: location.description || null,
      screenshot_url: location.screenshot_url || null,
      favorite: location.favorite,
      color: location.color || null,
    })
    .eq("id", location.id)
    .select()
    .single()

  if (error) throw error
  revalidatePath("/")
  return mapDbLocation(data as DbLocation)
}

export async function toggleFavorite(id: string, favorite: boolean): Promise<Location> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("locations").update({ favorite }).eq("id", id).select().single()

  if (error) throw error
  revalidatePath("/")
  return mapDbLocation(data as DbLocation)
}

export async function deleteLocation(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("locations").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/")
}

// Helper to map DB types to app types
function mapDbLocation(db: DbLocation): Location {
  return {
    id: db.id,
    name: db.name,
    type: db.type as Location["type"],
    x: db.x,
    y: db.y,
    z: db.z,
    dimension: db.dimension as Location["dimension"],
    world_id: db.world_id,
    description: db.description,
    screenshot_url: db.screenshot_url,
    created_at: db.created_at,
    favorite: db.favorite,
    color: db.color,
  }
}
