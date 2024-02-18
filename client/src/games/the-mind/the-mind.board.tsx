import { TheMindState } from '@games';
import {
  CountDown,
  GameBoardPropsWrapper,
  GameLobby,
  LobbyPlayerList,
} from 'components';
import {
  Button,
  Container,
  Box,
  Text,
  Stack,
  Flex,
  Card,
  Group,
  Avatar,
  SimpleGrid,
  Indicator,
  Grid,
} from '@mantine/core';
import { IconCards, IconArrowRight } from '@tabler/icons-react';
import { generateColor } from 'utils/generate-color';
import styles from './the-mind.module.css';
import { parseLogEntry } from './utils';
import { FunHubBoardProps } from 'types';

const GAME_PHASE_READY_UP = 'readyUpPhase';

const TheMindBoardComponent = ({
  G,
  ctx,
  playerID,
  matchData: players,
  moves,
  log,
  gameConfig,
}: FunHubBoardProps<TheMindState>) => {
  const url = window.location.href;
  const { phase, currentPlayer } = ctx;

  if (phase === GAME_PHASE_READY_UP) {
    const allPlayersReady = Object.values(G.players).every(
      (player) => player.isReady
    );

    return (
      <GameLobby gameMetadata={gameConfig} copyPasteUrl={url}>
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
      <Container my="md">
        <Grid>
          <Grid.Col span={{ base: 12, xs: 3 }}>
            <Card className={styles.card} mih={120} withBorder>
              <Text className={styles.title} mb="md">
                Game info
              </Text>
              <SimpleGrid cols={2}>
                <Text size="xs">Game:</Text>
                <Text size="xs" style={{ fontWeight: 'bold' }}>
                  {gameConfig.title}
                </Text>
                <Text size="xs">Level:</Text>
                <Text size="xs" style={{ fontWeight: 'bold' }}>
                  {G.currentLevel}
                </Text>
                <Text size="xs">Players:</Text>
                <Text size="xs" style={{ fontWeight: 'bold' }}>
                  {players?.length}
                </Text>
              </SimpleGrid>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 3 }} mah={180}>
            <Card className={styles.card} withBorder>
              <Text className={styles.title} mb="md">
                Log
              </Text>
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  overflow: 'scroll',
                }}
              >
                <Stack gap={2}>
                  {log.flatMap((logEntry, idx) => {
                    let parsedLog = parseLogEntry(logEntry, players);

                    if (parsedLog) {
                      if (idx === log.length - 1) {
                        return [
                          <Text
                            size="xs"
                            display="flex"
                            style={{ alignItems: 'center', gap: 4 }}
                          >
                            <IconArrowRight size={18} color="teal" />
                            {parsedLog}
                          </Text>,
                        ];
                      } else {
                        return [<Text size="xs">{parsedLog}</Text>];
                      }
                    }
                    return [];
                  })}
                </Stack>
              </Card>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Card className={styles.card} mih={120} withBorder>
              <Text className={styles.title} mb="md">
                Players
              </Text>
              <SimpleGrid cols={3}>
                {players?.map((player) => {
                  const playerColor = generateColor(player.id) || 'gray';
                  return (
                    <Flex gap={12} align="center">
                      <Flex gap={6} align="center">
                        <Avatar color={playerColor} radius="xl" size={22}>
                          {player.name?.slice(0, 2).toUpperCase() || 'N/A'}
                        </Avatar>
                        <Text size="xs" style={{ fontWeight: 'bold' }}>
                          {player.name}
                        </Text>
                      </Flex>
                      <Indicator
                        inline
                        size={12}
                        label={
                          <Text size="8px">
                            {G.players[player.id].hand.length}
                          </Text>
                        }
                      >
                        <Flex gap={1} align="center">
                          <IconCards size={22} />
                        </Flex>
                      </Indicator>
                    </Flex>
                  );
                })}
              </SimpleGrid>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 12 }}>
            <Card className={styles.card} mih={120} withBorder>
              <Text className={styles.title} mb="md">
                Cards played
              </Text>
              <Group>
                {G.discard.map((playedCard) => (
                  <Avatar radius="sm">{playedCard}</Avatar>
                ))}
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 12 }}>
            <Card className={styles.card} mih={120} withBorder>
              <Text className={styles.title} mb="md">
                Your hand
              </Text>
              <Group>
                {G.players[playerID as string]?.hand.map((card) => (
                  <Button
                    key={card}
                    variant="light"
                    onClick={() => moves.playCard(card)}
                  >
                    {card}
                  </Button>
                ))}
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (phase === 'winPhase') {
    return <Button onClick={() => moves.nextLevel()}>Next level</Button>;
  }

  if (phase === 'losePhase') {
    return <Button onClick={() => moves.playAgain()}>Play again</Button>;
  }

  return <Box>Welcome to {phase}</Box>;
};

export const TheMindBoard = GameBoardPropsWrapper(TheMindBoardComponent);
