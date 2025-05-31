import { Ctx } from 'boardgame.io'
import {
  GAME_START_COUNTDOWN_SECONDS,
  MultiplayerGamePlayer,
  MultiplayerGameWithLobbyState,
} from '../types'

export const ROWS = 6
export const COLS = 7

export type PlayerID = string

export type Cell = PlayerID | null
export type Board = Cell[][]
export type Coordinate = [number, number]

export type ConnectFourPlayer = MultiplayerGamePlayer & {
  name?: string
}

export type ConnectFourState = MultiplayerGameWithLobbyState<ConnectFourPlayer> & {
  board: Board
  winner: string
  winningCoords: Coordinate[] | null
  draw: boolean
  recentPiece: {
    row: number
    col: number
    playerId: string
  } | null
}

export const setup: (ctx: Ctx, setupData?: unknown) => ConnectFourState = ({
  playOrder,
}): ConnectFourState => {
  const players: { [key: string]: ConnectFourPlayer } = {}
  playOrder.forEach((playerId, idx) => {
    players[playerId] = {
      isReady: false,
      name: `Player ${idx + 1}`,
    }
  })
  return {
    board: createEmptyBoard(),
    gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
    players,
    winner: '',
    winningCoords: null,
    draw: false,
    recentPiece: null,
  }
}

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

export function checkWinner(board: Board, playerID: PlayerID): Coordinate[] | null {
  const directions: [number, number][] = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal right-down
    [1, -1], // diagonal left-down
  ]

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== playerID) continue

      for (const [dr, dc] of directions) {
        const coords: Coordinate[] = [[row, col]]
        let r = row + dr
        let c = col + dc

        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === playerID) {
          coords.push([r, c])
          if (coords.length === 4) return coords
          r += dr
          c += dc
        }
      }
    }
  }

  return null
}

export const resetGame = (G: ConnectFourState, ctx: Ctx) => {
  G.board = createEmptyBoard()
  G.winner = ''
  G.winningCoords = null
  G.draw = false
  G.recentPiece = null
  ctx.playOrder.forEach(playerId => {
    G.players[playerId].isReady = false
  })
}
