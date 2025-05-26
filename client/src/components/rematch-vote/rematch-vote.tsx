import { MultiplayerGamePlayer } from '@games';
import { Box, Button, rem, ThemeIcon } from '@mantine/core';
import { IconCircleX } from '@tabler/icons-react';
import { IconCircleCheck, IconCircleDotted } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { ActivePlayers, FilteredMetadata } from 'boardgame.io';
import { FC } from 'react';

type RematchVote = {
  onClick: () => void;
  isReady: boolean;
  matchData?: FilteredMetadata;
  players: { [key: string]: MultiplayerGamePlayer };
};

export const RematchVote: FC<RematchVote> = ({
  onClick,
  matchData,
  players,
  isReady,
}) => {
  return (
    <Box
      display="flex"
      style={{
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Button
        size="xs"
        variant="light"
        onClick={onClick}
        rightSection={
          isReady ? <IconCheck size={16} /> : <IconCircleDotted size={16} />
        }
      >
        Rematch
      </Button>
      {matchData?.map(({ id }) => {
        const isReady = players[id].isReady;
        return isReady ? (
          <ThemeIcon key={id} color="teal" size={26} radius="xl">
            <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        ) : (
          <ThemeIcon key={id} color="red" size={26} radius="xl">
            <IconCircleX style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        );
      })}
    </Box>
  );
};
