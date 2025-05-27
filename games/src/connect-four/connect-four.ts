import { Ctx, Game } from 'boardgame.io'
import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/core'
import {
  CommonGamePhases,
  GAME_START_COUNTDOWN_SECONDS,
  MultiplayerGamePlayer,
  MultiplayerGameWithLobbyState,
} from '../types'

const ROWS = 6
const COLS = 7

type PlayerID = string

type Cell = PlayerID | null
type Board = Cell[][]
type Coordinate = [number, number]

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

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function checkWinner(board: Board, playerID: PlayerID): Coordinate[] | null {
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

const resetGame = (G: ConnectFourState, ctx: Ctx) => {
  G.board = createEmptyBoard()
  G.winner = ''
  G.winningCoords = null
  G.draw = false
  G.recentPiece = null
  ctx.playOrder.forEach(playerId => {
    G.players[playerId].isReady = false
  })
}

export const ConnectFour: Game<ConnectFourState> = {
  name: 'ConnectFour',
  setup: ({ playOrder }): ConnectFourState => {
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
  },
  phases: {
    [CommonGamePhases.ReadyUpPhase]: {
      onBegin: G => {
        G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
      },
      moves: {
        toggleReady: (G, ctx, name) => {
          G.players[ctx.playerID as string].isReady =
            !G.players[ctx.playerID as string].isReady

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
    },
    [CommonGamePhases.PlayPhase]: {
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
    },
    [CommonGamePhases.WinPhase]: {
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
    },
  },
}
