import {
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { LoveLetterState, StageKey, CommonGamePhases } from '@games';
import {
  GameBoardPropsWrapper,
  LoveLetterShowHands,
  RematchVote,
} from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { FunHubBoardProps } from 'types';
import { LoveLetterPlayerCard } from 'components/love-letter-player-card/love-letter-player-card';
import { ActionMap } from './action-map';
import { useMediaQuery } from 'usehooks-ts';

export const LoveLetterBoardComponent = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => {
    const {
      G,
      ctx: { currentPlayer, activePlayers, phase },
      playerID,
      matchData,
      moves,
    } = props;
    const tablet = useMediaQuery('(min-width: 620px)');
    const desktop = useMediaQuery('(min-width: 1000px)');
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

    let cols = 1;
    if (tablet) cols = 2;
    if (desktop) cols = 3;

    const Action = ActionMap[currentStage] || null;

    return (
      <Box style={{ margin: 'auto' }}>
        <Stack gap="xs" mb="md" align="center">
          <SimpleGrid cols={cols} w="100%">
            {players.map((player, idx) => (
              <Box key={idx} w="100%">
                <LoveLetterPlayerCard
                  player={player}
                  hasBorder={currentPlayer === player.id}
                />
              </Box>
            ))}
          </SimpleGrid>
          <Divider w="100%" />
          <Box w="100%" maw={600}>
            <LoveLetterPlayerCard
              player={clientPlayer}
              hasBorder={currentPlayer === clientPlayer.id}
              isClientPlayer
            />
          </Box>
        </Stack>

        <Card
          py="sm"
          pos="sticky"
          bottom={0}
          mx={-24}
          mt="md"
          style={{ zIndex: 99, justifyContent: 'center' }}
        >
          <Paper px="xs" py="xs">
            <Flex direction="column">
              {G.message.map((text, idx) => (
                <Text
                  key={idx}
                  size="xs"
                  c={idx === G.message.length - 1 ? 'red' : 'indigo'}
                >
                  {idx === G.message.length - 1 ? '> ' : ''}
                  {text}
                </Text>
              ))}
            </Flex>
          </Paper>
          {(isClientTurn || baronData) &&
            phase === CommonGamePhases.PlayPhase && (
              <>
                <Divider my="xs" />
                <Center style={{ flexDirection: 'column' }}>
                  <Action {...props} />
                </Center>
              </>
            )}
          {phase === CommonGamePhases.WinPhase && (
            <>
              <Divider my="xs" />
              <Group justify="space-between">
                <RematchVote
                  onClick={() => moves.restart()}
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
