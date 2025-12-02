-- Seed initial world
INSERT INTO worlds (name) VALUES ('Survival Principal');

-- Get the world ID for seeding locations
DO $$
DECLARE
  world_id UUID;
BEGIN
  SELECT id INTO world_id FROM worlds WHERE name = 'Survival Principal' LIMIT 1;
  
  -- Seed some initial locations
  INSERT INTO locations (name, type, x, y, z, dimension, world_id, description) VALUES
    ('Base Principal', 'base', 156, 64, -234, 'overworld', world_id, 'Mi base principal con todo el almacenamiento'),
    ('Portal del Nether', 'portal', 19, 64, -29, 'nether', world_id, 'Portal conectado a la base'),
    ('Spawner de Zombies', 'spawner', -456, 23, 789, 'overworld', world_id, 'Granja de XP'),
    ('Fortaleza del End', 'structure', -1200, 32, 800, 'overworld', world_id, 'Portal al End encontrado'),
    ('Aldea de Intercambio', 'village', 340, 70, -890, 'overworld', world_id, 'Aldeanos con buenos trades'),
    ('Fortaleza Nether', 'structure', -200, 65, 150, 'nether', world_id, 'Blazes y Wither Skeletons');
END $$;
