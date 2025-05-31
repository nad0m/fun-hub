import { FC, useEffect, useRef, useState } from 'react';
import {
  COLS,
  CommonGamePhases,
  ConnectFourSp,
  ConnectFourState,
} from '@games';
import { Avatar, Box, Button, Card, Center, Loader, Text } from '@mantine/core';
import './styles.css';
import { ConnectFourClientSP } from './connect-four.client';
import { MCTSBot, Step } from 'boardgame.io/ai';
import { ClientState } from 'boardgame.io/dist/types/src/client/client';
import { useLocalStorage } from 'usehooks-ts';
import { GameContentWrapper } from 'components/game-content-wrapper';
import { PlayerRegister } from 'components';
import { isNonEmptyString } from 'utils/validators';
import { GAMES_GLOSSARY } from 'config/games';

type ConnectFourComponentSPProps = {
  playerName: string;
};

export const ConnectFourComponentSP: FC<ConnectFourComponentSPProps> = ({
  playerName,
}) => {
  const [gameState, setGameState] = useState<ClientState<ConnectFourState>>();
  const { G, ctx } = gameState || {};
  const { moves, playerID } = ConnectFourClientSP;
  const boardRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef<boolean>(false);
  const { board, winner, winningCoords, draw, players, recentPiece } = G || {};
  const { currentPlayer, phase } = ctx || {};
  const clientPlayer = players?.[playerID as string];

  useEffect(() => {
    ConnectFourClientSP.start();
    moves.changeName(playerName);
    const unsubscribe = ConnectFourClientSP.subscribe((state) => {
      setGameState(state);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (col: number) => {
    if (
      currentPlayer !== '0' ||
      isAnimating.current ||
      phase !== CommonGamePhases.PlayPhase
    ) {
      return;
    }
    moves.dropPiece(col);
  };

  useEffect(() => {
    if (currentPlayer === '1') {
      setTimeout(() => {
        Step(
          ConnectFourClientSP,
          new MCTSBot({
            enumerate: ConnectFourSp.ai?.enumerate,
            game: ConnectFourSp,
            iterations: 1,
            playoutDepth: 1,
          })
        );
      }, 1000);
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (recentPiece) {
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, 500);
    }
  }, [recentPiece]);

  if (!gameState || !clientPlayer) {
    return <Loader />;
  }

  const renderCell = (row: number, col: number) => {
    const value = board![row][col];
    let className = 'cell';
    if (value === '0') className += ' blue';
    else if (value === '1') className += ' red';

    const winnerPiece = winningCoords?.some(([r, c]) => {
      return r === row && c === col;
    });

    if (winnerPiece) className += ' highlight';
    else if (row === recentPiece?.row && col == recentPiece.col)
      className += ' recent';

    const timing = (row + 1) * 80;
    const winningCoordTiming =
      winnerPiece && recentPiece ? (recentPiece.row + 1) * 80 : 360;
    return (
      <Center
        key={`${row}-${col}`}
        className={className}
        style={{
          transition: `background ${timing}ms step-end, outline ${timing}ms step-end, border ${winningCoordTiming}ms step-end`,
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
              : `${players![winner!].name} achieved Connect Four!`}
          </Text>
        ) : (
          <Text fw={900} c="teal">
            {players![currentPlayer!].name}'s turn...
          </Text>
        )}
      </Center>
      <Card
        className="shadow"
        p="md"
        bg="#2e2e2e"
        maw={500}
        m="12px auto"
        radius="lg"
        withBorder
      >
        <Box className="board" ref={boardRef}>
          {board!.map((row, rowIndex) => (
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
                animation: `drop-${recentPiece.row} ${(recentPiece.row + 1) * 80}ms ease-in`,
              }}
            />
          )}
        </Box>
      </Card>

      {phase === CommonGamePhases.WinPhase ? (
        <Center my="md">
          <Button variant="light" onClick={() => moves.restart()}>
            Rematch
          </Button>
        </Center>
      ) : (
        <Center style={{ flexDirection: 'column' }}>
          <Avatar
            size="md"
            style={{
              background: playerID === '0' ? 'rgb(0, 52, 182)' : '#e03131',
            }}
          />
          <Text size="xs" fw={700}>
            {clientPlayer!.name}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export const ConnectFourBoardSP = () => {
  const [playerName] = useLocalStorage<string>('playerName', '');

  if (!isNonEmptyString(playerName)) {
    return (
      <GameContentWrapper>
        <PlayerRegister gameTitle={GAMES_GLOSSARY.ConnectFourSP.title} />
      </GameContentWrapper>
    );
  }

  return <ConnectFourComponentSP playerName={playerName} />;
};
