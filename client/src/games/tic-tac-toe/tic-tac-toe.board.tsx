import { CommonGamePhases, TicTacToeState } from '@games';
import { FunHubBoardProps } from 'types';
import { GameBoardPropsWrapper } from 'components';
import { GameWithLobbyWrapper } from 'components/game-with-lobby-wrapper';
import styles from './tic-tac-toe.module.css';

const range = (max: number, min: number = 0): number[] =>
  [...Array(max - min)].map((_, i) => i + min);

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
    currentPlayer === playerID ? 'Your' : `${getPlayerChar(currentPlayer)}'s`;

  return (
    <div>
      {!isEndGame && <div>{turnPlayerLabel} turn</div>}
      {isEndGame && (
        <div>
          Game Result:{' '}
          <label>
            {playerHasWon
              ? `${getPlayerChar(G.winner)} is the winner!`
              : 'Draw'}
          </label>
          <button
            style={{ display: 'block' }}
            onClick={() => moves.resetGame()}
          >
            Reset Game
          </button>{' '}
        </div>
      )}
      <table id="board" className={styles.gameBoard + styles.boardDisabled}>
        <tbody>
          {range(3).map((i) => (
            <tr key={i}>
              {range(3).map((j) => {
                const id = i * 3 + j;
                return (
                  <td
                    key={j}
                    style={{
                      border: '1px solid #555',
                      width: '50px',
                      height: '50px',
                      lineHeight: '50px',
                      textAlign: 'center',
                    }}
                    onClick={() => props.moves.clickCell(id)}
                  >
                    {getPlayerChar(props.G.cells[id])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TicTacToeBoard = GameBoardPropsWrapper(
  (props: FunHubBoardProps<TicTacToeState>) => (
    <GameWithLobbyWrapper {...props}>
      <TicTacToeBoardComponent {...props} />
    </GameWithLobbyWrapper>
  )
);
