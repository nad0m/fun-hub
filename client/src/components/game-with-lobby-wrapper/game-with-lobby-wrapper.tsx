import { CommonGamePhases, MultiplayerGameWithLobbyState } from '@games';
import { CountDown } from 'components/count-down';
import { GameLobby } from 'components/game-lobby';
import { LobbyPlayerList } from 'components/lobby-player-list';

import { PropsWithChildren } from 'react';
import { FunHubBoardProps } from 'types';

export function GameWithLobbyWrapper<
  GameState extends MultiplayerGameWithLobbyState,
>({
  G,
  ctx,
  playerID,
  matchData: players,
  moves,
  gameConfig,
  children,
}: FunHubBoardProps<GameState> & PropsWithChildren) {
  const url = window.location.href;
  const { phase, currentPlayer } = ctx;

  // if game is still in ready-up, we'll render the lobby dialog
  if (phase === CommonGamePhases.ReadyUpPhase) {
    const allPlayersReady = Object.values(G.players).every(
      (player) => player.isReady
    );

    return (
      <GameLobby gameMetadata={gameConfig} copyPasteUrl={url}>
        <LobbyPlayerList
          matchData={players}
          gameState={G}
          clientPlayerID={playerID}
          moves={moves}
        />
        {allPlayersReady && (
          <CountDown
            moves={moves}
            time={G.gameStartTimer}
            isCurrentPlayer={currentPlayer === playerID}
          />
        )}
      </GameLobby>
    );
  }

  // else, render the game content
  return children;
}
