import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { config } from 'dotenv';

config();
const supabaseUrl = `https://${process.env.PROJECT_REF}.supabase.co`;
const supabaseKey = process.env.SUPABASE_KEY || '';

type Log = {
  playerName: string;
  playerID: string;
  matchID: string;
  gameName: string;
  playerCredentials: string;
};

export const logJoinEvent = async (log: Log) => {
  const table = process.env.NODE_ENV === 'production' ? 'join_log_prod' : null;

  if (!table) {
    return;
  }

  const { playerName, playerID, matchID, gameName, playerCredentials } = log;

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  const { error } = await supabase.from(table).insert({
    player_name: playerName,
    player_id: playerID,
    match_id: matchID,
    game_name: gameName,
    player_credentials: playerCredentials,
  });

  if (error) {
    console.error('Failed to insert log:', error);
    throw error;
  }
};
