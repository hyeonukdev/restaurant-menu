-- Migrate prices table to remove name column
-- Run this in Supabase SQL Editor

-- 1. Create new prices table without name column
CREATE TABLE prices_new (
  id SERIAL PRIMARY KEY,
  dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Copy data from old table to new table (keeping only one price per dish)
INSERT INTO prices_new (dish_id, price, created_at)
SELECT DISTINCT ON (dish_id) dish_id, price, created_at
FROM prices
ORDER BY dish_id, created_at DESC;

-- 3. Drop old table
DROP TABLE prices;

-- 4. Rename new table to original name
ALTER TABLE prices_new RENAME TO prices;

-- 5. Recreate indexes
CREATE INDEX idx_prices_dish_id ON prices(dish_id);

-- 6. Verify the migration
SELECT * FROM prices ORDER BY dish_id; 