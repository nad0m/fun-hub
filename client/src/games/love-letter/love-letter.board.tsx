import {
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import {
  LoveLetterState,
  StageKey,
  CommonGamePhases,
  BaseCards,
  BaseCardsLg,
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
import { useMediaQuery } from 'usehooks-ts';

export const LoveLetterBoardComponent = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => {
    const {
      G,
      ctx: { currentPlayer, activePlayers, phase, numPlayers },
      playerID,
      matchData,
      moves,
    } = props;
    const tablet = useMediaQuery('(min-width: 620px)');
    const desktop = useMediaQuery('(min-width: 1000px)');
    const baronData = G.players[playerID as string]?.baronData;
    const players = Object.values(G.players);
    const playersStillActive = Object.values(G.players).filter(
      ({ isActive }) => isActive
    );
    const baseCards = numPlayers > 4 ? BaseCardsLg : BaseCards;
    const clientPlayer = G.players[playerID || ''];
    const isClientTurn = currentPlayer === playerID;
    const currentStage: StageKey | null =
      (activePlayers?.[playerID || ''] as StageKey) || null;

    let miw: string | number = '100%';
    if (tablet) miw = 350;
    if (desktop) miw = 450;

    const Action = ActionMap[currentStage] || null;

    return (
      <Box style={{ margin: 'auto' }}>
        <Stack gap="xs" mb="md" align="center">
          <Flex w="100%" wrap="wrap" gap={8} justify="center">
            {players.map((player, idx) => (
              <Box key={idx} flex={1} miw={miw} maw={miw}>
                <LoveLetterPlayerCard
                  player={player}
                  deck={G.deck}
                  hasBorder={currentPlayer === player.id}
                  isClientPlayer={playerID === player.id}
                />
              </Box>
            ))}
          </Flex>
          <Divider w="100%" />
          <Box w="100%" maw={400}>
            <LoveLetterPlayerCard
              player={clientPlayer}
              deck={G.deck}
              hasBorder={false}
              isClientPlayer
              handOnly
            />
          </Box>
        </Stack>

        <Card
          py="sm"
          pos="sticky"
          bottom={0}
          mx={tablet ? 'auto' : -24}
          mt="md"
          maw={800}
          style={{
            zIndex: 99,
            justifyContent: 'center',
          }}
        >
          <Paper px="xs" py="xs" h={104}>
            <Flex direction="column" justify="flex-end" h="100%">
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
                  discard={G.discard}
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
