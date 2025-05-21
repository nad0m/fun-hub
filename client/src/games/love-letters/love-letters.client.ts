import { LoveLetters } from '@games';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { LoveLettersBoard } from './love-letters.board';

export const LoveLettersClient = Client({
  game: LoveLetters,
  board: LoveLettersBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: true,
});
