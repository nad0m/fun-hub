import { TicTacToe } from '@games';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SERVER_URL } from 'config/constants';
import { TicTacToeBoard } from './tic-tac-toe.board';

export const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false,
});
