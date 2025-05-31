import { Game } from 'boardgame.io'
import { CommonGamePhases } from '../types'
import { playPhase, winPhase } from './phases'
import { ConnectFourState, getBestMove, setup } from './utils'

export const ConnectFourSp: Game<ConnectFourState> = {
  name: 'ConnectFourSp',
  phases: {
    [CommonGamePhases.PlayPhase]: {
      ...playPhase,
      start: true,
    },
    [CommonGamePhases.WinPhase]: winPhase,
  },
  setup,
  ai: {
    enumerate: G => {
      const col = getBestMove(G.board)
      return [{ move: 'dropPiece', args: [col] }]
    },
  },
}
