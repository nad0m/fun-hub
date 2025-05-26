import { useEffect, useRef, useState } from 'react';
import { CommonGamePhases, ConnectFourState } from '@games';
import { FunHubBoardProps } from 'types';
import { Box, Card, Center, Text } from '@mantine/core';
import './styles.css';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { GameBoardPropsWrapper, RematchVote } from 'components';
import { IconStar } from '@tabler/icons-react';

const ROWS = 6;
const COLS = 7;

type AnimatingPiece = {
  row: number;
  col: number;
  player: string;
};

export const ConnectFourComponent = (
  props: FunHubBoardProps<ConnectFourState>
) => {
  const { G, ctx, moves, isActive, matchData } = props;
  const [animatingPiece, setAnimatingPiece] = useState<AnimatingPiece | null>(
    null
  );
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { board, winner, winningCoords, draw, players, recentPiece } = G;
  const { currentPlayer, phase, playerID } = ctx;
  const clientPlayer = players[playerID as string];

  const handleClick = (col: number) => {
    if (
      !isActive ||
      animatingPiece !== null ||
      phase !== CommonGamePhases.PlayPhase
    )
      return;
    moves.dropPiece(col);
  };

  const prevBoardRef = useRef(JSON.parse(JSON.stringify(G.board)));

  useEffect(() => {
    const prevBoard = prevBoardRef.current;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (prevBoard[row][col] === null && G.board[row][col] !== null) {
          const newPiece = { row, col, player: G.board[row][col] as string };
          setAnimatingPiece(newPiece);
          setTimeout(() => {
            setAnimatingPiece(null);
          }, 500);
          prevBoardRef.current = JSON.parse(JSON.stringify(G.board));
          return;
        }
      }
    }
    prevBoardRef.current = JSON.parse(JSON.stringify(G.board));
  }, [G.board]);

  const renderCell = (row: number, col: number) => {
    const value = board[row][col];
    let className = 'cell';
    if (value === '0') className += ' yellow';
    else if (value === '1') className += ' red';

    const highlight = winningCoords?.some(([r, c]) => {
      return r === row && c === col;
    });

    return (
      <Center key={`${row}-${col}`} className={className}>
        {highlight && !animatingPiece && <IconStar color="lime" />}
      </Center>
    );
  };

  return (
    <Box>
      <Center>
        {phase === CommonGamePhases.WinPhase ? (
          <Text fw={900} c="teal">
            {draw
              ? 'No moves available. Tie game.'
              : `${players[winner].name} achieved Connect Four!`}
          </Text>
        ) : (
          <Text fw={900} c="teal">
            {players[currentPlayer].name}'s turn...
          </Text>
        )}
      </Center>
      <Card p="md" bg="#242424" maw={550} m="auto" withBorder>
        <Box className="board" ref={boardRef}>
          {board.map((row, rowIndex) => (
            <Box key={rowIndex} className="row">
              {row.map((_, colIndex) => (
                <Box
                  key={colIndex}
                  className="column"
                  onClick={() => handleClick(colIndex)}
                >
                  {renderCell(rowIndex, colIndex)}
                </Box>
              ))}
            </Box>
          ))}
          {animatingPiece && boardRef.current && (
            <Box
              className={`piece ${animatingPiece.player === '0' ? 'yellow' : 'red'}`}
              style={{
                top: 0,
                left: `${
                  (boardRef.current.clientWidth / COLS) * animatingPiece.col +
                  boardRef.current.clientWidth / COLS / 2 -
                  (boardRef.current.clientWidth / COLS) * 0.45
                }px`,
                animation: `drop-${animatingPiece.row} 0.5s ease-in forwards`,
              }}
            />
          )}
        </Box>
      </Card>
      {phase === CommonGamePhases.WinPhase && (
        <Center my="md">
          <RematchVote
            onClick={() => moves.restart()}
            matchData={matchData}
            isReady={clientPlayer?.isReady}
            players={players}
          />
        </Center>
      )}
    </Box>
  );
};

export const ConnectFourBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<ConnectFourState>) => (
    <GameWithLobbyWrapper {...props}>
      <ConnectFourComponent {...props} />
    </GameWithLobbyWrapper>
  )
);
