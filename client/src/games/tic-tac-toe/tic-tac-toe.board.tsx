import { useMemo } from 'react';
import { TicTacToeState } from '@games';
import { FunHubBoardProps } from 'types';
import { GameBoardPropsWrapper } from 'components';

const range = (max: number, min: number = 0): number[] =>
  [...Array(max - min)].map((_, i) => i + min);

const TicTacToeBoardComponent = (props: FunHubBoardProps<TicTacToeState>) => {
  const winner = useMemo(() => {
    if (props.ctx.gameover) {
      return props.ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {props.ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
    }
  }, [props.ctx.gameover]);

  return (
    <div>
      <table id="board">
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
                    {props.G.cells[id]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {winner}
    </div>
  );
};

export const TicTacToeBoard = GameBoardPropsWrapper(TicTacToeBoardComponent);
