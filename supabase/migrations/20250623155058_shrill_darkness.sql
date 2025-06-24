/*
  # Create emotions table for Anon Board

  1. New Tables
    - `emotions`
      - `id` (uuid, primary key)
      - `text` (text, emotion message)
      - `emotion` (text, emotion type)
      - `x` (numeric, x position on board)
      - `y` (numeric, y position on board)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `emotions` table
    - Add policy for anyone to read emotions
    - Add policy for anyone to insert emotions (anonymous)
*/

CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL CHECK (length(text) <= 100),
  emotion text NOT NULL CHECK (emotion IN ('sadness', 'anger', 'hope', 'joy', 'emptiness', 'anxiety')),
  x numeric NOT NULL CHECK (x >= 0 AND x <= 100),
  y numeric NOT NULL CHECK (y >= 0 AND y <= 100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read emotions (public access)
CREATE POLICY "Anyone can read emotions"
  ON emotions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert emotions (anonymous posting)
CREATE POLICY "Anyone can insert emotions"
  ON emotions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS emotions_created_at_idx ON emotions(created_at DESC);