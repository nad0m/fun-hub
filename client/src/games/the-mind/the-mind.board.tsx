import { CommonGamePhases, TheMindState } from '@games';
import { GameBoardPropsWrapper } from 'components';
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
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';

const TheMindBoardComponent = (props: FunHubBoardProps<TheMindState>) => {
  const {
    G,
    ctx: { phase },
    playerID,
    matchData: players,
    moves,
    log,
    gameConfig,
  } = props;

  if (phase === CommonGamePhases.PlayPhase) {
    return (
      <Container my="md" display="flex">
        <Card className={styles.card} h="50vh" withBorder>
          <Text className={styles.title} mb="md">
            Players
          </Text>
          <Stack>
            {players?.map((player) => {
              const playerColor = generateColor(player.id) || 'gray';
              return (
                <Card
                  p={12}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                  withBorder
                >
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
                      <Text size="8px">{G.players[player.id].hand.length}</Text>
                    }
                  >
                    <Flex gap={1} align="center">
                      <IconCards size={22} />
                    </Flex>
                  </Indicator>
                </Card>
              );
            })}
          </Stack>
        </Card>
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

          <Grid.Col span={{ base: 12, xs: 9 }}>
            <Card className={styles.card} mih={120} withBorder>
              <Text className={styles.title} mb="md">
                Players
              </Text>
              <SimpleGrid cols={2}>
                {players?.map((player) => {
                  const playerColor = generateColor(player.id) || 'gray';
                  return (
                    <Card
                      p={12}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                      withBorder
                    >
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
                    </Card>
                  );
                })}
              </SimpleGrid>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 12 }} mah={130}>
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
                            fs="italic"
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

  if (phase === CommonGamePhases.WinPhase) {
    return <Button onClick={() => moves.nextLevel()}>Next level</Button>;
  }

  if (phase === CommonGamePhases.LosePhase) {
    return <Button onClick={() => moves.playAgain()}>Play again</Button>;
  }

  return <Box>Unexpected phase encountered: {phase}</Box>;
};

export const TheMindBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<TheMindState>) => (
    <GameWithLobbyWrapper {...props}>
      <TheMindBoardComponent {...props} />
    </GameWithLobbyWrapper>
  )
);
