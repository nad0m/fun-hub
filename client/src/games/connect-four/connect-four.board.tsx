import { useEffect, useRef, useState } from 'react';
import { CommonGamePhases, ConnectFourState } from '@games';
import { FunHubBoardProps } from 'types';
import { Avatar, Box, Card, Center, Text } from '@mantine/core';
import './styles.css';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { GameBoardPropsWrapper, RematchVote } from 'components';

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
  const { G, ctx, moves, isActive, matchData, playerID } = props;
  const [animatingPiece, setAnimatingPiece] = useState<AnimatingPiece | null>(
    null
  );
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { board, winner, winningCoords, draw, players, recentPiece } = G;
  const { currentPlayer, phase } = ctx;
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
          setTimeout(
            () => {
              setAnimatingPiece(null);
            },
            (row + 1) * 100
          );
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
    if (value === '0') className += ' blue';
    else if (value === '1') className += ' red';

    const winnerPiece = winningCoords?.some(([r, c]) => {
      return r === row && c === col;
    });

    if (winnerPiece) className += ' highlight';

    const timing = (row + 1) * 100;
    const winningCoordTiming =
      winnerPiece && recentPiece ? (recentPiece[0] + 1) * 100 : 600;
    return (
      <Center
        key={`${row}-${col}`}
        className={className}
        style={{
          transition: `background ${timing}ms step-end, border ${winningCoordTiming}ms step-end`,
        }}
      />
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
      <Card p="md" bg="#242424" maw={500} m="auto" radius="lg" withBorder>
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
              className={`piece ${animatingPiece.player === '0' ? 'blue' : 'red'}`}
              style={{
                top: 0,
                left: `${
                  (boardRef.current.clientWidth / COLS) * animatingPiece.col +
                  boardRef.current.clientWidth / COLS / 2 -
                  (boardRef.current.clientWidth / COLS) * 0.4
                }px`,
                animation: `drop-${animatingPiece.row} 0.${animatingPiece.row + 1}s ease-in`,
              }}
            />
          )}
        </Box>
      </Card>

      {phase === CommonGamePhases.WinPhase ? (
        <Center my="md">
          <RematchVote
            onClick={() => moves.restart()}
            matchData={matchData}
            isReady={clientPlayer?.isReady}
            players={players}
          />
        </Center>
      ) : (
        <Center m="md" style={{ flexDirection: 'column' }}>
          <Avatar
            size="md"
            style={{
              background: playerID === '0' ? 'rgb(0, 52, 182)' : '#e03131',
            }}
          />
          <Text size="xs" fw={700}>
            {clientPlayer.name}
          </Text>
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
