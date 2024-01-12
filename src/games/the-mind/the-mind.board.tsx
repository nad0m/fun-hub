import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { TheMindState } from 'atom-games';
import { CopyToClipboardInput, GameLobby, LobbyPlayerList } from 'components';
import { Button, Switch, Container, Box, Text, Stack, Title, Flex } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { GAMES_GLOSSARY } from '../../constants';

const GAME_NAME = 'TheMind';
const GAME_PHASE_READY_UP = 'readyUpPhase';

export const TheMindBoard: React.FunctionComponent<BoardProps<TheMindState>> = ({
  G,
  ctx,
  playerID,
  credentials,
  events,
  matchData: players,
  moves,
  matchID,
}) => {
  const url = window.location.href;
  const { phase, currentPlayer, activePlayers } = ctx;
  console.log({ players });
  const { isReady } = G.players[playerID as string];

  if (phase === 'readyUpPhase') {
    return (
      <GameLobby gameMetadata={GAMES_GLOSSARY[GAME_NAME]} copyPasteUrl={url}>
        <LobbyPlayerList
          matchData={players}
          gameState={G}
          clientPlayerID={playerID}
          moves={moves}
        />
      </GameLobby>
    );
  }

  return <Box>Welcome to {phase}</Box>;
};
