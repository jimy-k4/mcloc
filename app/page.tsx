"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { LocationGrid } from "@/components/location-grid"
import { AddLocationModal } from "@/components/add-location-modal"
import { StatsPanel } from "@/components/stats-panel"
import { FilterBar } from "@/components/filter-bar"
import { CoordinateMap } from "@/components/coordinate-map"
import { ScreenshotsSection } from "@/components/screenshots-section"
import type { Location, LocationType, Dimension, World } from "@/lib/types"
import { getWorlds, getLocations, createWorld, createLocation, updateLocation, deleteLocation } from "@/app/actions"

export default function Home() {
  const [worlds, setWorlds] = useState<World[]>([])
  const [activeWorld, setActiveWorld] = useState<string>("")
  const [locations, setLocations] = useState<Location[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [activeFilter, setActiveFilter] = useState<LocationType | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapDimension, setMapDimension] = useState<Dimension>("overworld")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWorlds() {
      try {
        const fetchedWorlds = await getWorlds()
        setWorlds(fetchedWorlds)
        if (fetchedWorlds.length > 0) {
          setActiveWorld(fetchedWorlds[0].id)
        }
      } catch (error) {
        console.error("Error loading worlds:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadWorlds()
  }, [])

  useEffect(() => {
    async function loadLocations() {
      if (!activeWorld) return
      try {
        const fetchedLocations = await getLocations(activeWorld)
        setLocations(fetchedLocations)
      } catch (error) {
        console.error("Error loading locations:", error)
      }
    }
    loadLocations()
  }, [activeWorld])

  // Get screenshots for separate section
  const screenshots = locations.filter((loc) => loc.type === "screenshot")

  const filteredLocations = locations.filter((loc) => {
    const matchesType = activeFilter === "all" || loc.type === activeFilter
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleAddLocation = async (newLocation: Omit<Location, "id" | "created_at">) => {
    try {
      const created = await createLocation(newLocation)
      setLocations([created, ...locations])
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error creating location:", error)
    }
  }

  const handleEditLocation = async (updatedLocation: Location) => {
    try {
      const updated = await updateLocation(updatedLocation)
      setLocations(locations.map((loc) => (loc.id === updated.id ? updated : loc)))
      setEditingLocation(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error updating location:", error)
    }
  }

  const handleDeleteLocation = async (id: string) => {
    try {
      await deleteLocation(id)
      setLocations(locations.filter((loc) => loc.id !== id))
    } catch (error) {
      console.error("Error deleting location:", error)
    }
  }

  const handleOpenEdit = (location: Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleAddWorld = async (name: string) => {
    try {
      const newWorld = await createWorld(name)
      setWorlds([...worlds, newWorld])
      setActiveWorld(newWorld.id)
    } catch (error) {
      console.error("Error creating world:", error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingLocation(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-muted-foreground">CARGANDO DATOS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Header
        onAddClick={() => setIsModalOpen(true)}
        worlds={worlds}
        activeWorld={activeWorld}
        onWorldChange={setActiveWorld}
        onAddWorld={handleAddWorld}
      />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <StatsPanel locations={locations} />

        <CoordinateMap locations={locations} activeDimension={mapDimension} onDimensionChange={setMapDimension} />

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <LocationGrid
          locations={filteredLocations}
          onDelete={handleDeleteLocation}
          onEdit={handleOpenEdit}
          viewMode={viewMode}
        />

        <ScreenshotsSection screenshots={screenshots} onDelete={handleDeleteLocation} />
      </main>

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddLocation}
        onEdit={handleEditLocation}
        editingLocation={editingLocation}
        activeWorld={activeWorld}
      />
    </div>
  )
}
