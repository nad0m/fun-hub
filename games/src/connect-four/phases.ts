import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/dist/types/packages/core'
import { CommonGamePhases, GAME_START_COUNTDOWN_SECONDS } from '../types'
import { Ctx, PhaseMap } from 'boardgame.io'
import {
  checkWinner,
  ConnectFourState,
  createEmptyBoard,
  PlayerID,
  resetGame,
  ROWS,
} from './utils'

export const readyUpPhase: PhaseMap<ConnectFourState, Ctx>[0] = {
  onBegin: G => {
    G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
  },
  moves: {
    toggleReady: (G, ctx, name) => {
      G.players[ctx.playerID as string].isReady = !G.players[ctx.playerID as string].isReady

      if (!G.players[ctx.playerID as string].isReady) {
        G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
      }
      G.players[ctx.playerID as string].name = name
    },
    countDownToTransition: G => {
      G.gameStartTimer -= 1
    },
  },
  endIf: G => {
    return G.gameStartTimer === 0
  },
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  onEnd: resetGame,
  start: true,
  next: CommonGamePhases.PlayPhase,
}

export const playPhase: PhaseMap<ConnectFourState, Ctx>[0] = {
  moves: {
    dropPiece(G: ConnectFourState, ctx: Ctx, col: number) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (G.board[row][col] === null) {
          G.board[row][col] = ctx.currentPlayer as PlayerID
          G.recentPiece = {
            row,
            col,
            playerId: ctx.currentPlayer,
          }
          return
        }
      }
      return INVALID_MOVE
    },
    reset: (G: ConnectFourState) => {
      G.board = createEmptyBoard()
    },
  },
  turn: {
    onEnd: (G: ConnectFourState, ctx: Ctx) => {
      const currentPlayer = ctx.currentPlayer as PlayerID
      const coords = checkWinner(G.board, currentPlayer)
      if (coords) {
        G.winner = currentPlayer
        G.winningCoords = coords
      }
      if (G.board.every(row => row.every(cell => cell !== null))) {
        G.draw = true
      }
    },
    moveLimit: 1,
  },
  endIf: G => {
    return !!(G.winner || G.draw)
  },
  next: CommonGamePhases.WinPhase,
}

export const winPhase: PhaseMap<ConnectFourState, Ctx>[0] = {
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    restart: (G, { playerID }) => {
      G.players[playerID as string].isReady = true
    },
  },
  endIf: G => {
    const players = Object.values(G.players)
    return players.every(({ isReady }) => isReady)
  },
  onEnd: resetGame,
  next: CommonGamePhases.PlayPhase,
}
