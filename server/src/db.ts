import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { config } from 'dotenv';

config();
const supabaseUrl = `https://${process.env.PROJECT_REF}.supabase.co`;
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type Log = {
  playerName: string;
  playerID: string;
  matchID: string;
  gameName: string;
  playerCredentials: string;
};

export const logJoinEvent = async (log: Log) => {
  const table = process.env.NODE_ENV === 'production' ? 'join_log_prod' : 'join_log_dev';
  const { playerName, playerID, matchID, gameName, playerCredentials } = log;

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
