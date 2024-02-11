import type { Client } from 'boardgame.io/react';

export type GameConfig = {
  id: string;
  title: string;
  description: string;
  path: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
};

export type GameClient = ReturnType<typeof Client>;

export type GamePageProps = {
  gameConfig: GameConfig;
  GameClientComponent: GameClient;
};
