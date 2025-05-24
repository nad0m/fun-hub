import { TheMind } from '@games';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { TheMindBoard } from './the-mind.board';

export const TheMindClient = Client({
  game: TheMind,
  board: TheMindBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false,
});
