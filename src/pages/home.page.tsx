import { Lobby } from 'boardgame.io/react';
import { TheMind, TicTacToe } from 'atom-games';
import { TicTacToeBoard } from '@games/tic-tac-toe';
import { TheMindBoard } from '@games/the-mind';
import { ApplicationCard } from '@components/application-card';
import { SimpleGrid } from '@mantine/core';
import { GAMES_GLOSSARY } from '../constants';

export function HomePage() {
  return (
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
}
