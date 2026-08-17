/*
  # Add published column and order_index to meteor_house_portfolio

  ## Changes
    - Add `published` column to meteor_house_portfolio (boolean, default: true)
    - Add `order_index` column if not exists
    - Update RLS policies for better access control
*/

-- Add published column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meteor_house_portfolio' AND column_name = 'published'
  ) THEN
    ALTER TABLE meteor_house_portfolio ADD COLUMN published boolean DEFAULT true;
  END IF;
END $$;

-- Add order_index column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meteor_house_portfolio' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE meteor_house_portfolio ADD COLUMN order_index integer DEFAULT 0;
  END IF;
END $$;

-- Drop and recreate RLS policies for portfolio
DROP POLICY IF EXISTS "Anyone can view published portfolio items" ON meteor_house_portfolio;
DROP POLICY IF EXISTS "Authenticated users can manage portfolio" ON meteor_house_portfolio;

CREATE POLICY "Anyone can view published portfolio items"
  ON meteor_house_portfolio
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage portfolio"
  ON meteor_house_portfolio
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);