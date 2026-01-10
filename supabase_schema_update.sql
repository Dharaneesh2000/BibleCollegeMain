-- SQL Migration to add missing 'about_content' column to news_events table
-- Run this in your Supabase SQL Editor

ALTER TABLE news_events
ADD COLUMN IF NOT EXISTS about_content TEXT;

-- Note: The column is nullable (allows NULL values) which matches the code's usage
-- If you want to set a default value, you can use:
-- ALTER TABLE news_events ADD COLUMN about_content TEXT DEFAULT '';


