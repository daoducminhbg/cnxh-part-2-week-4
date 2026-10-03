-- =========================================================================
-- KỲ HỌP NGHỊ TRƯỜNG - XỬ LÝ HỒ SƠ & TRƯNG CẦU Ý DÂN
-- Database Schema & Supabase Realtime Setup (Optional for persistent DB)
-- =========================================================================

-- 1. Create table for Session State (optional persistence)
CREATE TABLE IF NOT EXISTS parliament_sessions (
  id TEXT PRIMARY KEY,
  current_scenario_id TEXT NOT NULL,
  scenario_index INTEGER NOT NULL DEFAULT 0,
  delegate_name TEXT NOT NULL,
  selected_option_id TEXT,
  is_answer_revealed BOOLEAN DEFAULT FALSE,
  is_answer_correct BOOLEAN,
  lifelines JSONB NOT NULL,
  vote_tally JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create table for individual Voter Records
CREATE TABLE IF NOT EXISTS parliament_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  voter_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_voter_scenario UNIQUE(scenario_id, voter_id)
);

-- 3. Enable Supabase Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE parliament_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE parliament_votes;

-- NOTE: The application uses Supabase Realtime Broadcast Channels ('parliament-arena')
-- which sends ultra-low latency (< 100ms) ephemereal messages directly between
-- the 60 voter mobile devices, the admin desk, and the projector arena screen!
