/*
  # Create Portfolio Projects and Testimonials Tables

  1. New Tables
    - `portfolio_projects`
      - `id` (uuid, primary key)
      - `title` (text) - Project name
      - `slug` (text, unique) - URL-friendly identifier
      - `category` (text) - Project category (Nonprofit, E-commerce, etc.)
      - `description` (text) - Short project description
      - `long_description` (text) - Detailed project description
      - `tags` (text[]) - Technology tags
      - `thumbnail_url` (text) - Cover image URL
      - `live_url` (text) - Link to live site
      - `is_featured` (boolean) - Whether project is featured
      - `created_at` (timestamptz) - Creation timestamp

    - `testimonials`
      - `id` (uuid, primary key)
      - `client_name` (text) - Client's name
      - `company` (text) - Company name
      - `industry` (text) - Client industry
      - `quote` (text) - Testimonial text
      - `rating` (integer) - Star rating 1-5
      - `created_at` (timestamptz) - Creation timestamp

    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `phone` (text) - Phone number
      - `company` (text) - Company name
      - `project_type` (text) - Type of project
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Submission timestamp

  2. Security
    - RLS enabled on all tables
    - Public read access for portfolio_projects and testimonials (public-facing data)
    - Insert-only access for contact_submissions (form submissions)
*/

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  thumbnail_url text NOT NULL DEFAULT '',
  live_url text NOT NULL DEFAULT '',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio projects are publicly readable"
  ON portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are publicly readable"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  project_type text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
