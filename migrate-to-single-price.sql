-- Migrate to single price column in dishes table
-- Run this in Supabase SQL Editor

-- 1. Add price column to dishes table
ALTER TABLE dishes ADD COLUMN price INTEGER;

-- 2. Update dishes table with prices from prices table
UPDATE dishes 
SET price = (
  SELECT price 
  FROM prices 
  WHERE prices.dish_id = dishes.id 
  LIMIT 1
);

-- 3. Set price to 0 for dishes without prices
UPDATE dishes SET price = 0 WHERE price IS NULL;

-- 4. Make price column NOT NULL
ALTER TABLE dishes ALTER COLUMN price SET NOT NULL;

-- 5. Drop prices table (this will also drop related foreign keys)
DROP TABLE IF EXISTS prices CASCADE;

-- 6. Verify the migration
SELECT id, name, price FROM dishes ORDER BY id; 