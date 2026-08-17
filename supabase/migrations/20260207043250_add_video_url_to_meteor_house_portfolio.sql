/*
  # Add video_url and is_featured to meteor_house_portfolio

  ## Changes
    - Add `video_url` column (text, nullable) - URL to video content
    - Add `is_featured` column (boolean, default: false) - Mark featured portfolio items
*/

-- Add video_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meteor_house_portfolio' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE meteor_house_portfolio ADD COLUMN video_url text;
  END IF;
END $$;

-- Add is_featured column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meteor_house_portfolio' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE meteor_house_portfolio ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;