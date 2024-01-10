import { Lobby } from 'boardgame.io/react';
import { TheMind, TicTacToe } from 'atom-games';
import { ApplicationCard } from 'components/application-card';
import { SimpleGrid } from '@mantine/core';
import { TheMindBoard, TicTacToeBoard } from 'games';
import { FC } from 'react';
import { GAMES_GLOSSARY } from '../constants';

export const HomePage: FC = () => (
  <>
    <SimpleGrid cols={4}>
      {Object.values(GAMES_GLOSSARY).map((game) => (
        <ApplicationCard key={game.title} game={game} />
      ))}
    </SimpleGrid>
    <Lobby
      gameServer={import.meta.env.VITE_ATOM_SOCKET_API}
      lobbyServer={import.meta.env.VITE_ATOM_SOCKET_API}
      gameComponents={[
        { game: TicTacToe, board: TicTacToeBoard },
        { game: TheMind, board: TheMindBoard },
      ]}
      debug
    />
  </>
);
