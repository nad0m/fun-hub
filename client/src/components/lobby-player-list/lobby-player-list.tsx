import {
  Avatar,
  Button,
  CheckIcon,
  ColorSwatch,
  Container,
  Flex,
  Group,
  List,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from '@mantine/core';
import {
  IconPointer,
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconClick,
  IconHandClick,
  IconCircleDotted,
} from '@tabler/icons-react';
import { TheMindState } from '@games';
import { FilteredMetadata } from 'boardgame.io';
import { FC } from 'react';
import { generateColor } from 'utils/generate-color';

type LobbyPlayerListProps = {
  gameState: TheMindState;
  matchData?: FilteredMetadata;
  clientPlayerID: string | null;
  moves: Record<string, (...args: any[]) => void>;
};

export const LobbyPlayerList: FC<LobbyPlayerListProps> = ({
  gameState,
  matchData,
  clientPlayerID,
  moves,
}) => {
  console.log({ matchData });
  return (
    // State

    // Effects

    <Stack>
      {matchData?.map((player) => {
        const playerColor = generateColor(player.id) || 'gray';
        const playerNamePostfix =
          clientPlayerID === player.id.toString() ? ' (You)' : '';
        const { isReady } = gameState.players[clientPlayerID as string];

        return (
          <Flex
            key={player.id}
            w="100%"
            style={{ justifyContent: 'space-between' }}
            align="center"
            gap={24}
          >
            <Flex align="center" gap={8} w={250}>
              {player.isConnected ? (
                <Avatar color={playerColor} radius="xl" size={28}>
                  {player.name?.slice(0, 2).toUpperCase() || 'N/A'}
                </Avatar>
              ) : (
                <Loader size={26} color={playerColor} />
              )}
              <Text size="sm">
                {player.isConnected && player.name
                  ? `${player.name}${playerNamePostfix}`
                  : 'Waiting for player...'}
              </Text>
            </Flex>
            {gameState.players[player.id].isReady ? (
              <ThemeIcon color="teal" size={26} radius="xl">
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            ) : (
              <ThemeIcon color="red" size={26} radius="xl">
                <IconCircleX style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            )}
            <Button
              variant="light"
              size="xs"
              color={isReady ? 'teal' : 'gray'}
              onClick={() => moves?.toggleReady()}
              rightSection={
                isReady ? (
                  <IconCheck size={16} />
                ) : (
                  <IconCircleDotted size={16} />
                )
              }
              style={{
                visibility: !playerNamePostfix ? 'hidden' : 'visible',
                padding: '0 8px',
              }}
            >
              Ready
            </Button>
          </Flex>
        );
      })}
    </Stack>
  );
};
