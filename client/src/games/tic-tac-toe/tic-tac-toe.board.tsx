import { CommonGamePhases, TicTacToeState } from '@games';
import { FunHubBoardProps } from 'types';
import { GameBoardPropsWrapper } from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import styles from './tic-tac-toe.module.css';
import { Button, Center, Stack, Text } from '@mantine/core';
import { IconCircle, IconX } from '@tabler/icons-react';

const range = (max: number, min: number = 0): number[] =>
  [...Array(max - min)].map((_, i) => i + min);

const getPlayerIcon = (id: string | null) => {
  if (!id) return '';
  return id === '1' ? (
    <IconX color="red" size={42} />
  ) : (
    <IconCircle color="blue" size={36} />
  );
};

const getPlayerChar = (id: string | null) => {
  if (!id) return '';
  return id === '1' ? 'X' : 'O';
};

const TicTacToeBoardComponent = (props: FunHubBoardProps<TicTacToeState>) => {
  const {
    G,
    ctx: { phase, currentPlayer },
    moves,
    playerID,
  } = props;

  const playerHasWon = phase === CommonGamePhases.WinPhase;
  const isDraw = phase === CommonGamePhases.DrawPhase;
  const isEndGame = playerHasWon || isDraw;

  const turnPlayerLabel =
    currentPlayer === playerID ? 'Your' : `${getPlayerChar(playerID)}'s`;

  return (
    <Center style={{ flexDirection: 'column', gap: 8 }}>
      {!isEndGame && (
        <Text fw={600} c="cyan">
          {turnPlayerLabel} turn
        </Text>
      )}
      {isEndGame && (
        <Stack>
          <Text fw={600} c="cyan">
            {playerHasWon
              ? `${getPlayerChar(G.winner)} is the winner!`
              : 'Draw'}
          </Text>
          <Button size="xs" variant="light" onClick={() => moves.resetGame()}>
            Reset game
          </Button>
        </Stack>
      )}
      <table id="board" className={styles.gameBoard}>
        <tbody>
          {range(3).map((i) => (
            <Center key={i}>
              {range(3).map((j) => {
                const id = i * 3 + j;
                return (
                  <Center
                    key={j}
                    style={{
                      flexDirection: 'column',
                      border: '1px solid #555',
                      width: '15vw',
                      height: '15vw',
                    }}
                    onClick={() => props.moves.clickCell(id)}
                  >
                    {getPlayerIcon(props.G.cells[id])}
                  </Center>
                );
              })}
            </Center>
          ))}
        </tbody>
      </table>
    </Center>
  );
};

export const TicTacToeBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<TicTacToeState>) => (
    <GameWithLobbyWrapper {...props}>
      <TicTacToeBoardComponent {...props} />
    </GameWithLobbyWrapper>
  )
);
