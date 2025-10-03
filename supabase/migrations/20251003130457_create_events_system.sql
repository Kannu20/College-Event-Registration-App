/*
  # College Event Registration System

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text) - Event name
      - `description` (text) - Event details
      - `event_date` (date) - Event date
      - `event_time` (time) - Event time
      - `location` (text) - Venue location
      - `poster_url` (text, optional) - Cloudinary image URL
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `student_name` (text) - Participant name
      - `student_email` (text) - Participant email
      - `registered_at` (timestamptz) - Registration timestamp

  2. Security
    - Enable RLS on both tables
    - Allow public read access to events (students can view)
    - Allow public insert to registrations (students can register)
    - Allow public create/update/delete for events (admin operations)

  3. Indexes
    - Index on event_date for faster filtering of upcoming events
    - Index on event_id in registrations for faster participant lookups

  4. Important Notes
    - Unique constraint on (event_id, student_email) prevents duplicate registrations
    - Cascade delete removes registrations when event is deleted
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text NOT NULL,
  poster_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  student_email text NOT NULL,
  registered_at timestamptz DEFAULT now(),
  UNIQUE(event_id, student_email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Events policies: Allow public access for all operations
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert events"
  ON events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete events"
  ON events FOR DELETE
  TO anon, authenticated
  USING (true);

-- Registrations policies: Allow public access for all operations
CREATE POLICY "Anyone can view registrations"
  ON registrations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete registrations"
  ON registrations FOR DELETE
  TO anon, authenticated
  USING (true);