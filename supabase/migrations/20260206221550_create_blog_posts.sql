/*
  # Create Blog Posts Table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text) - Blog post title
      - `slug` (text, unique) - URL-friendly identifier
      - `excerpt` (text) - Short preview text
      - `content` (text) - Full post content (markdown)
      - `cover_image_url` (text) - Cover image URL
      - `author` (text) - Author name
      - `published_at` (timestamptz) - Publication date
      - `is_published` (boolean) - Publication status
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - RLS enabled
    - Public read access for published posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Sites on Polaris',
  published_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are publicly readable"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);
