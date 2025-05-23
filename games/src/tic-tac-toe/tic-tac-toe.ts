import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/core'
import {
  CommonGamePhases,
  GAME_START_COUNTDOWN_SECONDS,
  MultiplayerGamePlayer,
  MultiplayerGameWithLobbyState,
} from '../types'

export type TicTacToeState = MultiplayerGameWithLobbyState & {
  winner: string
  cells: (string | null)[]
}

const resetGame = (G: TicTacToeState) => {
  G.winner = ''
  G.cells = Array(9).fill(null)
}

const phases: PhaseMap<TicTacToeState, Ctx> = {
  [CommonGamePhases.ReadyUpPhase]: {
    // we want to let all players "ready up"
    turn: { activePlayers: ActivePlayers.ALL },
    onBegin: G => {
      G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
    },
    moves: {
      toggleReady: (G, ctx) => {
        G.players[ctx.playerID as string].isReady = !G.players[ctx.playerID as string].isReady

        if (!G.players[ctx.playerID as string].isReady) {
          G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
        }
      },
      countDownToTransition: G => {
        G.gameStartTimer -= 1
      },
    },
    endIf: G => {
      return G.gameStartTimer === 0
    },
    start: true,
    next: CommonGamePhases.PlayPhase,
  },
  [CommonGamePhases.PlayPhase]: {
    // lock in turns
    turn: {
      minMoves: 1,
      maxMoves: 1,
    },
    onBegin: G => {
      G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
    },
    moves: {
      clickCell: (G, ctx, id) => {
        if (G.cells[id] !== null) return INVALID_MOVE
        G.cells[id] = ctx.currentPlayer
      },
    },
    endIf: G => {
      return IsVictory(G.cells) || IsDraw(G.cells)
    },
    onEnd: (G, ctx) => {
      if (IsVictory(G.cells)) G.winner = ctx.currentPlayer
    },
    next: G => (G.winner ? CommonGamePhases.WinPhase : CommonGamePhases.DrawPhase),
  },

  // These two are identical – both are end game configs.
  [CommonGamePhases.DrawPhase]: {
    turn: { activePlayers: ActivePlayers.ALL },
    moves: { resetGame },
    endIf: G => !G.cells[0], // first cell is empty
    next: CommonGamePhases.PlayPhase,
  },
  [CommonGamePhases.WinPhase]: {
    turn: { activePlayers: ActivePlayers.ALL },
    moves: { resetGame },
    endIf: G => !G.cells[0], // first cell is empty
    next: CommonGamePhases.PlayPhase,
  },
}

export const TicTacToe: Game<TicTacToeState> = {
  name: 'TicTacToe',
  phases,
  setup: ({ playOrder }) => {
    const players: { [key: string]: MultiplayerGamePlayer } = {}
    playOrder.forEach(playerId => {
      players[playerId] = {
        isReady: false,
      }
    })
    return {
      cells: Array(9).fill(null),
      winner: '',
      players,
      gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
    }
  },
}

// Return true if `cells` is in a winning configuration.
function IsVictory(cells: TicTacToeState['cells']) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  return positions
    .map(row => {
      const symbols = row.map(i => cells[i])
      return symbols.every(i => i !== null && i === symbols[0])
    })
    .some(i => i)
}

// Return true if all `cells` are occupied.
function IsDraw(cells: TicTacToeState['cells']) {
  return cells.filter(c => c === null).length === 0
}
