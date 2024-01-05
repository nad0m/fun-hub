import { Lobby } from 'boardgame.io/react';
import { TicTacToe } from 'atom-games';
import { TicTacToeBoard } from '@games/tic-tac-toe';
import { Welcome } from '@components/Welcome/Welcome';
import { ColorSchemeToggle } from '@components/ColorSchemeToggle/ColorSchemeToggle';

export function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Lobby
        gameServer={import.meta.env.VITE_ATOM_SOCKET_API}
        lobbyServer={import.meta.env.VITE_ATOM_SOCKET_API}
        gameComponents={[{ game: TicTacToe, board: TicTacToeBoard }]}
      />
    </>
  );
}
