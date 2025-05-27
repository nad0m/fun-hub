import { useEffect, useRef } from 'react';
import { CommonGamePhases, ConnectFourState } from '@games';
import { FunHubBoardProps } from 'types';
import { Avatar, Box, Card, Center, Text } from '@mantine/core';
import './styles.css';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import { GameBoardPropsWrapper, RematchVote } from 'components';

const COLS = 7;

export const ConnectFourComponent = (
  props: FunHubBoardProps<ConnectFourState>
) => {
  const { G, ctx, moves, isActive, matchData, playerID } = props;
  const boardRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef<boolean>(false);
  const { board, winner, winningCoords, draw, players, recentPiece } = G;
  const { currentPlayer, phase } = ctx;
  const clientPlayer = players[playerID as string];

  const handleClick = (col: number) => {
    if (
      !isActive ||
      isAnimating.current ||
      phase !== CommonGamePhases.PlayPhase
    )
      return;
    moves.dropPiece(col);
  };

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
      winnerPiece && recentPiece ? (recentPiece.row + 1) * 100 : 600;
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

  useEffect(() => {
    if (recentPiece) {
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, 600);
    }
  }, [recentPiece]);

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
      <Card p="md" bg="#2e2e2e" maw={500} m="auto" radius="lg" withBorder>
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
          {recentPiece && boardRef.current && (
            <Box
              key={`${recentPiece.row}-${recentPiece.col}-${recentPiece.playerId}`}
              className={`piece ${recentPiece.playerId === '0' ? 'blue' : 'red'}`}
              style={{
                top: -10,
                left: `${
                  (boardRef.current.clientWidth / COLS) * recentPiece.col +
                  boardRef.current.clientWidth / COLS / 2 -
                  (boardRef.current.clientWidth / COLS) * 0.4
                }px`,
                opacity: 0,
                animation: `drop-${recentPiece.row} 0.${recentPiece.row + 1}s ease-in`,
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
