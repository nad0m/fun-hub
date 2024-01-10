import { List, ThemeIcon, rem } from '@mantine/core';
import { IconCircleCheck, IconCircleDashed } from '@tabler/icons-react';
import { FilteredMetadata } from 'boardgame.io';
import { FC } from 'react';

type LobbyPlayerListProps = {
  matchData?: FilteredMetadata;
};

export const LobbyPlayerList: FC<LobbyPlayerListProps> = ({ matchData }) => (
  // State

  // Effects

  <List
    spacing="xs"
    size="sm"
    center
    icon={
      <ThemeIcon color="teal" size={24} radius="xl">
        <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
      </ThemeIcon>
    }
  >
    {matchData?.map((player) => (
      <List.Item
        key={player.id}
        icon={
          player.isConnected ? (
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleDashed style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          ) : (
            <ThemeIcon color="orange" size={24} radius="xl">
              <IconCircleDashed style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          )
        }
      >
        {player.isConnected ? player.name : 'Waiting for player...'}
      </List.Item>
    ))}
  </List>
);
