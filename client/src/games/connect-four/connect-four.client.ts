import { ConnectFour, ConnectFourSp } from '@games';
import { Client } from 'boardgame.io/react';
import { Client as VanillaClient } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { ConnectFourBoard } from './connect-four.board';

export const ConnectFourClient = Client({
  game: ConnectFour,
  board: ConnectFourBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false,
});

export const ConnectFourClientSP = VanillaClient({
  game: ConnectFourSp,
  numPlayers: 2,
  debug: true,
  playerID: '0',
});
