import {
  Blockquote,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Indicator,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  LoveLetterState,
  LoveLetterStages,
  StageMoves,
  StageKey,
} from '@games';
import { GameBoardPropsWrapper } from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { FunHubBoardProps } from 'types';
import { LoveLetterPlayerCard } from 'components/love-letter-player-card/love-letter-player-card';
import { ActionMap } from './action-map';

export const LoveLetterBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => {
    const {
      G,
      ctx: { currentPlayer, activePlayers },
      playerID,
      matchData,
      moves,
      log,
      gameConfig,
    } = props;

    const priestData = G.players[playerID as string]?.priestData;
    const baronData = G.players[playerID as string]?.baronData;
    const players = Object.values(G.players).filter(
      ({ id }) => id !== playerID
    );
    const clientPlayer = G.players[playerID || ''];
    const isClientTurn = currentPlayer === playerID;
    const currentStage: StageKey | null =
      (activePlayers?.[playerID || ''] as StageKey) || null;

    console.log(props);

    console.log({ currentPlayer });

    return (
      <Box w="100vw" maw={700} p="md">
        <Stack gap="xs" mb="md">
          {players.map((player, idx) => (
            <LoveLetterPlayerCard
              key={idx}
              player={player}
              hasBorder={currentPlayer === player.id}
            />
          ))}
          <Divider />
          <LoveLetterPlayerCard
            player={clientPlayer}
            hasBorder={currentPlayer === clientPlayer.id}
            isClientPlayer
          />
        </Stack>
        <Paper
          display="flex"
          color="teal"
          p="xs"
          pos="sticky"
          bg="dark"
          bottom={0}
          radius={0}
          mx={-24}
          mb={-24}
          style={{ zIndex: 99, justifyContent: 'center' }}
        >
          <Text c="teal.4">{G.message}</Text>
        </Paper>
        {(isClientTurn || baronData) && (
          <Paper
            color="teal"
            py="sm"
            px="xl"
            pos="sticky"
            bg="dark"
            bottom={0}
            radius={0}
            mx={-24}
            mt="md"
            style={{ zIndex: 99, justifyContent: 'center' }}
          >
            {ActionMap[currentStage](props)}
          </Paper>
        )}
      </Box>
    );
  }
);
