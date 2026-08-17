/*
  # Add Booking Form Fields to consultation_submissions

  1. New Columns
    - `challenges` (text array): Stores selected challenges from booking form
      Options: 'no-leads', 'outdated-look', 'hard-to-update', 'too-slow', 
               'not-mobile-friendly', 'no-google-visibility', 'not-sure'
    - `budget_range` (text): Budget selection from booking form
      Options: '$500 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', 
               '$10,000 - $25,000', '$25,000+', 'Not Sure Yet'
    - `timeline` (text): Project timeline preference
      Options: 'ASAP', '1-2 Months', '3-6 Months', 'No Rush'
    - `project_details` (text): Freeform project description from booking form
    - `submission_source` (text): Distinguishes between 'booking-form' (quick consultation)
      and 'web-service-form' (detailed questionnaire)

  2. Purpose
    - Enables booking form (/booking) to properly submit to consultation_submissions table
    - Separates quick booking consultations from detailed web service questionnaires
    - Maintains backwards compatibility with existing web-service-form submissions

  3. Notes
    - All new columns are nullable to support existing records
    - submission_source defaults to 'web-service-form' for existing records
    - RLS policies remain unchanged (already configured for this table)
*/

-- Add new columns for booking form data
DO $$
BEGIN
  -- Add challenges array column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_submissions' AND column_name = 'challenges'
  ) THEN
    ALTER TABLE consultation_submissions 
    ADD COLUMN challenges text[] DEFAULT '{}';
  END IF;

  -- Add budget_range column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_submissions' AND column_name = 'budget_range'
  ) THEN
    ALTER TABLE consultation_submissions 
    ADD COLUMN budget_range text;
  END IF;

  -- Add timeline column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_submissions' AND column_name = 'timeline'
  ) THEN
    ALTER TABLE consultation_submissions 
    ADD COLUMN timeline text;
  END IF;

  -- Add project_details column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_submissions' AND column_name = 'project_details'
  ) THEN
    ALTER TABLE consultation_submissions 
    ADD COLUMN project_details text;
  END IF;

  -- Add submission_source column with default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_submissions' AND column_name = 'submission_source'
  ) THEN
    ALTER TABLE consultation_submissions 
    ADD COLUMN submission_source text DEFAULT 'web-service-form';
  END IF;
END $$;

-- Add helpful comment on submission_source column
COMMENT ON COLUMN consultation_submissions.submission_source IS 
  'Source of submission: "booking-form" for quick consultations, "web-service-form" for detailed questionnaires';
