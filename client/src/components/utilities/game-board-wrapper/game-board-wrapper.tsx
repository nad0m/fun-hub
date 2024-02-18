import { BoardProps } from 'boardgame.io/react';
import { FunHubBoardProps, GameConfig } from 'types';

/**
 * We have to wrap our boards with this component to extend the board props.
 * This is unfortunate, but the only way to get around it at this time.
 */
export function GameBoardPropsWrapper<GameState>(
  Board: React.FunctionComponent<FunHubBoardProps<GameState>>
) {
  return (props: BoardProps<GameState> & { gameConfig?: GameConfig }) => {
    if (!props.gameConfig) throw new Error('gameConfig is a required prop!');
    return <Board {...props} gameConfig={props.gameConfig!} />;
  };
}
