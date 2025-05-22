import {
  Box,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { LoveLetterState } from '@games';
import { GameBoardPropsWrapper } from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { FunHubBoardProps } from 'types';
import { LoveLetterPlayerCard } from 'components/love-letter-player-card/love-letter-player-card';

export const LoveLetterBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLetterState>) => {
    const {
      G,
      ctx: { currentPlayer },
      playerID,
      matchData,
      moves,
      log,
      gameConfig,
    } = props;

    const priestData = G.players[playerID as string]?.priestData;
    const baronData = G.players[playerID as string]?.baronData;
    const players = Object.values(G.players);

    console.log(props);

    console.log({ currentPlayer });

    return (
      <Box>
        <Stack gap="xs">
          {players.map((player, idx) => (
            <LoveLetterPlayerCard
              key={idx}
              player={player}
              hasBorder={currentPlayer === player.id}
            />
          ))}
        </Stack>
        <Text>{G.message}</Text>
        {priestData && (
          <Text>
            {priestData.targetName}: {priestData.targetCard.name}
          </Text>
        )}

        {baronData && (
          <Box>
            <Text>
              {baronData.targetName}: {baronData.targetCard.name}
            </Text>
            <Text>
              {baronData.playerName}: {baronData.playerCard.name}
            </Text>
          </Box>
        )}
        <SimpleGrid cols={5}>
          <Button onClick={() => moves.stageCard('Guard')}>Guard card</Button>
          <Button onClick={() => moves.stageCard('Priest')}>Priest card</Button>
          <Button onClick={() => moves.stageCard('Baron')}>Baron card</Button>
          <Button onClick={() => moves.stageCard('Handmaid')}>
            Handmaid card
          </Button>
          <Button onClick={() => moves.stageCard('Prince')}>Prince card</Button>
          <Button onClick={() => moves.stageCard('King')}>King card</Button>
          <Button onClick={() => moves.stageCard('Countess')}>
            Countess card
          </Button>
          <Button onClick={() => moves.stageCard('Princess')}>
            Princess card
          </Button>

          <Button onClick={() => moves.targetPlayer('0')}>Target 0</Button>
          <Button onClick={() => moves.targetPlayer('1')}>Target 1</Button>
          <Button onClick={() => moves.proceed('0')}>Proceed 0</Button>
          <Button onClick={() => moves.proceed('1')}>Proceed 1</Button>
          <Button
            onClick={() => moves.guessCard({ targetId: 1, guess: 'Prince' })}
          >
            Guess card
          </Button>
          <Button onClick={() => moves.endTurn()}>End turn</Button>
        </SimpleGrid>

        {Object.values(G.players).map((val, idx) => (
          <Box key={idx}>
            <Text>{val.name}</Text>
            <Text>Hand: {val.hand.map((card) => `${card.name},`)}</Text>
            <Text>Discard: {val.discard.map((card) => `${card.name},`)}</Text>
            <Text>IsActive: {val.isActive ? 'true' : 'false'}</Text>
            <Text>IsProtected: {val.isProtected ? 'true' : 'false'}</Text>
            <Divider />
          </Box>
        ))}

        <Text
          size="xl"
          fw={900}
          variant="gradient"
          gradient={{ from: 'red', to: 'cyan', deg: 45 }}
        >
          Your hand
        </Text>
      </Box>
    );
  }
);
