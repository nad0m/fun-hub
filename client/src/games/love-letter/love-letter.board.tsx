import {
  Blockquote,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Indicator,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  LoveLetterState,
  LoveLetterStages,
  StageMoves,
  StageKey,
  CommonGamePhases,
} from '@games';
import {
  GameBoardPropsWrapper,
  LoveLetterShowHands,
  RematchVote,
} from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { FunHubBoardProps } from 'types';
import { LoveLetterPlayerCard } from 'components/love-letter-player-card/love-letter-player-card';
import { ActionMap } from './action-map';
import {
  IconCheck,
  IconCircleCheck,
  IconCircleDotted,
  IconCircleX,
} from '@tabler/icons-react';

export const LoveLetterBoardComponent = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => {
    const {
      G,
      ctx: { currentPlayer, activePlayers, phase },
      playerID,
      matchData,
      moves,
    } = props;

    const baronData = G.players[playerID as string]?.baronData;
    const players = Object.values(G.players).filter(
      ({ id }) => id !== playerID
    );
    const playersStillActive = Object.values(G.players).filter(
      ({ isActive }) => isActive
    );
    const clientPlayer = G.players[playerID || ''];
    const isClientTurn = currentPlayer === playerID;
    const currentStage: StageKey | null =
      (activePlayers?.[playerID || ''] as StageKey) || null;

    return (
      <Box style={{ margin: 'auto' }} maw={700}>
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

        <Card
          py="sm"
          pos="sticky"
          bottom={0}
          mx={-24}
          mt="md"
          style={{ zIndex: 99, justifyContent: 'center' }}
        >
          <Text size="sm" c="teal.4" fw={700}>
            {G.message}
          </Text>
          {(isClientTurn || baronData) &&
            phase === CommonGamePhases.PlayPhase && (
              <>
                <Divider my="xs" />
                <Center style={{ flexDirection: 'column' }}>
                  {ActionMap[currentStage](props)}
                </Center>
              </>
            )}
          {phase === CommonGamePhases.WinPhase && (
            <>
              <Divider my="xs" />
              <Group justify="space-between">
                <RematchVote
                  onClick={moves.restart}
                  matchData={matchData}
                  isReady={clientPlayer?.isReady}
                  players={G.players}
                />
                <LoveLetterShowHands
                  players={playersStillActive}
                  defaultOpened={G.deck.length === 0}
                  subtitle={
                    G.deck.length === 0
                      ? 'No cards left in deck. Comparing hands:'
                      : "Winner's hand:"
                  }
                />
              </Group>
            </>
          )}
        </Card>
      </Box>
    );
  }
);

export const LoveLetterBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => (
    <GameWithLobbyWrapper {...props}>
      <LoveLetterBoardComponent {...props} />
    </GameWithLobbyWrapper>
  )
);
