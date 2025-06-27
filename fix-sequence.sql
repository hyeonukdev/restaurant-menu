-- Fix dishes sequence issue
-- Run this in Supabase SQL Editor

-- Check if sequence exists and get current value (if used)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'dishes_id_seq') THEN
        -- Try to get current value, but don't fail if not used yet
        BEGIN
            PERFORM currval('dishes_id_seq');
            RAISE NOTICE 'Current sequence value: %', currval('dishes_id_seq');
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Sequence not yet used in this session';
        END;
    ELSE
        RAISE NOTICE 'Sequence dishes_id_seq does not exist';
    END IF;
END $$;

-- Get max ID from dishes table
SELECT MAX(id) as max_dish_id FROM dishes;

-- Reset sequence to next value after max ID
SELECT setval('dishes_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM dishes)) as new_sequence_value;

-- Verify sequence is reset
SELECT currval('dishes_id_seq') as current_sequence_value; 