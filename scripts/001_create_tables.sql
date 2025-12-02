-- MCLOC Database Schema
-- Tables for worlds, locations, and screenshots

-- Worlds table
CREATE TABLE IF NOT EXISTS worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('base', 'portal', 'spawner', 'village', 'structure', 'biome', 'resource', 'screenshot')),
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  z INTEGER NOT NULL,
  dimension TEXT NOT NULL CHECK (dimension IN ('overworld', 'nether', 'end')),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  description TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (public access for now - no auth required)
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public policies (anyone can read/write - adjust for auth later if needed)
CREATE POLICY "Allow public read on worlds" ON worlds FOR SELECT USING (true);
CREATE POLICY "Allow public insert on worlds" ON worlds FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on worlds" ON worlds FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on worlds" ON worlds FOR DELETE USING (true);

CREATE POLICY "Allow public read on locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on locations" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on locations" ON locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on locations" ON locations FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_locations_world ON locations(world_id);
CREATE INDEX IF NOT EXISTS idx_locations_dimension ON locations(dimension);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
