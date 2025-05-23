import { BoardProps, Client } from 'boardgame.io/react';

export type GameConfig = {
  id: string;
  title: string;
  description: string;
  path: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
};

export type FunHubBoardProps<GameState> = BoardProps<GameState> & {
  gameConfig: GameConfig;
};

// Client returns a Client React component
export type ClientComponent = ReturnType<typeof Client>;

export type GamePageProps = {
  gameConfig: GameConfig;
  GameClientComponent: ClientComponent;
};
