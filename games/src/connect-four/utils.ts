import { Ctx } from 'boardgame.io'
import {
  GAME_START_COUNTDOWN_SECONDS,
  MultiplayerGamePlayer,
  MultiplayerGameWithLobbyState,
} from '../types'

export const ROWS = 6
export const COLS = 7
export const EMPTY = null
export const PLAYER = '0'
export const AI = '1'

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

export function getValidLocations(board: Board): number[] {
  return board[0].map((_, col) => col).filter(col => board[0][col] === EMPTY)
}

export function dropPiece(board: Board, row: number, col: number, piece: string): void {
  board[row][col] = piece
}

export function getNextOpenRow(board: Board, col: number): number | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r
  }
  return null
}

export function winningMove(board: Board, piece: string): boolean {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r][c + 1] === piece &&
        board[r][c + 2] === piece &&
        board[r][c + 3] === piece
      ) {
        return true
      }
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c] === piece &&
        board[r + 2][c] === piece &&
        board[r + 3][c] === piece
      ) {
        return true
      }
    }
  }

  // Positive diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c + 1] === piece &&
        board[r + 2][c + 2] === piece &&
        board[r + 3][c + 3] === piece
      ) {
        return true
      }
    }
  }

  // Negative diagonal
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r - 1][c + 1] === piece &&
        board[r - 2][c + 2] === piece &&
        board[r - 3][c + 3] === piece
      ) {
        return true
      }
    }
  }

  return false
}

export function scorePosition(board: Board, piece: string): number {
  const opponent = piece === PLAYER ? AI : PLAYER
  let score = 0

  // Center column preference
  const centerCol = Math.floor(COLS / 2)
  const centerArray = board.map(row => row[centerCol])
  const centerCount = centerArray.filter(cell => cell === piece).length
  score += centerCount * 6

  // Score a range of 4 cells
  function evaluateWindow(range: Cell[]): number {
    const countPiece = range.filter(p => p === piece).length
    const countEmpty = range.filter(p => p === EMPTY).length
    const countOpponent = range.filter(p => p === opponent).length

    if (countPiece === 4) return 100
    if (countPiece === 3 && countEmpty === 1) return 10
    if (countPiece === 2 && countEmpty === 2) return 5
    if (countOpponent === 3 && countEmpty === 1) return -80

    return 0
  }

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const range = [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]]
      score += evaluateWindow(range)
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const range = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]]
      score += evaluateWindow(range)
    }
  }

  // Positive Diagonal (\)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const range = [
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ]
      score += evaluateWindow(range)
    }
  }

  // Negative Diagonal (/)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const range = [
        board[r][c],
        board[r - 1][c + 1],
        board[r - 2][c + 2],
        board[r - 3][c + 3],
      ]
      score += evaluateWindow(range)
    }
  }

  return score
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): [number | null, number] {
  const validLocations = getValidLocations(board)
  const isTerminal =
    winningMove(board, PLAYER) || winningMove(board, AI) || validLocations.length === 0

  if (depth === 0 || isTerminal) {
    if (winningMove(board, AI)) return [null, 1000000]
    if (winningMove(board, PLAYER)) return [null, -1000000]
    return [null, scorePosition(board, AI)]
  }

  if (maximizing) {
    let value = -Infinity
    let bestCol = validLocations[0]
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col)!
      const newBoard = board.map(row => [...row])
      dropPiece(newBoard, row, col, AI)
      const [, newScore] = minimax(newBoard, depth - 1, alpha, beta, false)
      if (newScore > value) {
        value = newScore
        bestCol = col
      }
      alpha = Math.max(alpha, value)
      if (alpha >= beta) break
    }
    return [bestCol, value]
  } else {
    let value = Infinity
    let bestCol = validLocations[0]
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col)!
      const newBoard = board.map(row => [...row])
      dropPiece(newBoard, row, col, PLAYER)
      const [, newScore] = minimax(newBoard, depth - 1, alpha, beta, true)
      if (newScore < value) {
        value = newScore
        bestCol = col
      }
      beta = Math.min(beta, value)
      if (alpha >= beta) break
    }
    return [bestCol, value]
  }
}

export function getBestMove(board: Board, depth: number = 4): number {
  const [col] = minimax(board, depth, -Infinity, Infinity, true)
  return col!
}
