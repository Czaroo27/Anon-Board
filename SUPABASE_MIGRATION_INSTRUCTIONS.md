# Database Setup Instructions

The application is failing because the `emotions` table doesn't exist in your Supabase database.

## Steps to fix:

1. **Open your Supabase project dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the following SQL script:**

```sql
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
```

4. **Click "Run" to execute the SQL**

5. **Refresh your application**
   - The errors should be resolved once the table is created

## Verification

After running the SQL, you can verify the table was created by:
1. Going to "Table Editor" in your Supabase dashboard
2. You should see the `emotions` table listed
3. The table should have the correct columns and policies set up

Once this is done, your application should work correctly and be able to fetch and add emotions to the database.