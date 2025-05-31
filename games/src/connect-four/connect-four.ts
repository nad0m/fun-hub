import { Game } from 'boardgame.io'
import { CommonGamePhases } from '../types'
import { ConnectFourState, setup } from './utils'
import { playPhase, readyUpPhase, winPhase } from './phases'

export const ConnectFour: Game<ConnectFourState> = {
  name: 'ConnectFour',
  setup,
  phases: {
    [CommonGamePhases.ReadyUpPhase]: readyUpPhase,
    [CommonGamePhases.PlayPhase]: playPhase,
    [CommonGamePhases.WinPhase]: winPhase,
  },
}
