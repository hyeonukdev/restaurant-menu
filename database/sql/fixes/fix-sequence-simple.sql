-- Simple fix for dishes sequence issue
-- Run this in Supabase SQL Editor

-- Get current max ID
SELECT MAX(id) as current_max_id FROM dishes;

-- Reset sequence to next value
SELECT setval('dishes_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM dishes)) as sequence_reset_to;

-- Test next value
SELECT nextval('dishes_id_seq') as next_sequence_value; 