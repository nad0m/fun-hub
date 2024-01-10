import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { TheMindState } from 'atom-games';
import { LobbyPlayerList } from 'components';
import { Button, Switch } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

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
  const { phase, currentPlayer, activePlayers } = ctx;
  console.log({ activePlayers, playerID });
  const { isReady } = G.players[playerID as string];

  return (
    <div>
      <h4>{phase}</h4>
      <LobbyPlayerList matchData={players} />
      <Button
        variant="light"
        color={isReady ? 'teal' : 'gray'}
        onClick={() => moves?.toggleReady()}
        rightSection={isReady ? <IconCheck size={16} /> : null}
      >
        Ready
      </Button>
    </div>
  );
};
