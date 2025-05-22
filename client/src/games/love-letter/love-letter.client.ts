import { LoveLetter } from '@games';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { LoveLetterBoard } from './love-letter.board';

export const LoveLetterClient = Client({
  game: LoveLetter,
  board: LoveLetterBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: true,
});
