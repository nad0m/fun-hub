import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { TheMindState } from '@games';
import {
  CopyToClipboardInput,
  CountDown,
  GameLobby,
  LobbyPlayerList,
} from 'components';
import {
  Button,
  Switch,
  Container,
  Box,
  Text,
  Stack,
  Title,
  Flex,
  Card,
  Group,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { GAMES_GLOSSARY } from 'config/games';

const GAME_NAME = 'TheMind';
const GAME_PHASE_READY_UP = 'readyUpPhase';

export const TheMindBoard: React.FunctionComponent<
  BoardProps<TheMindState>
> = ({
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
  const { phase, currentPlayer } = ctx;

  if (phase === 'readyUpPhase') {
    const allPlayersReady = Object.values(G.players).every(
      (player) => player.isReady
    );

    return (
      <GameLobby gameMetadata={GAMES_GLOSSARY[GAME_NAME]} copyPasteUrl={url}>
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

  if (phase === 'playPhase') {
    return (
      <Stack>
        {G.discard.map((playedCard) => (
          <Card key={playedCard}>{playedCard}</Card>
        ))}
        <Group>
          {G.players[playerID as string]?.hand.map((card) => (
            <Button key={card} onClick={() => moves.playCard(card)}>
              {card}
            </Button>
          ))}
        </Group>
      </Stack>
    );
  }

  return <Box>Welcome to {phase}</Box>;
};
