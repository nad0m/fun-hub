import { ConnectFour } from '@games';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { ConnectFourBoard } from './connect-four.board';

export const ConnectFourClient = Client({
  game: ConnectFour,
  board: ConnectFourBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false,
});
