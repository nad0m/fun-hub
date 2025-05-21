import { Box, Button, Text } from '@mantine/core';
import { LoveLettersState } from '@games';
import { GameBoardPropsWrapper } from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { FunHubBoardProps } from 'types';

export const LoveLettersBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<LoveLettersState>) => {
    const {
      G,
      ctx: { phase },
      playerID,
      matchData: players,
      moves,
      log,
      gameConfig,
    } = props;

    console.log(props);

    return (
      <Box>
        <Text>{G.message}</Text>
        <Button onClick={() => moves.stageCard('Guard')}>Stage card</Button>
        <Button onClick={() => moves.targetPlayer('0')}>Target 0</Button>
        <Button onClick={() => moves.targetPlayer('1')}>Target 1</Button>
        <Button
          onClick={() => moves.guessCard({ targetId: 1, guess: 'Princess' })}
        >
          Guess card
        </Button>
        <Button onClick={() => moves.endTurn()}>End turn</Button>
      </Box>
    );
  }
);
