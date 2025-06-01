import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { ActivePlayers } from 'boardgame.io/core'
import {
  CommonGamePhases,
  GAME_START_COUNTDOWN_SECONDS,
  MultiplayerGamePlayer,
  MultiplayerGameWithLobbyState,
} from '../types'

export type GameStatus = 'pending' | 'win' | 'lose'

export type TheMindPlayer = MultiplayerGamePlayer & {
  hand: number[]
}

export type TheMindState = MultiplayerGameWithLobbyState<TheMindPlayer> & {
  currentLevel: number
  gameStatus: GameStatus
  deck: number[]
  gameAnswer: number[]
  discard: number[]
}

export type TheMindPhases = typeof phases

const phases: PhaseMap<TheMindState, Ctx> = {
  [CommonGamePhases.ReadyUpPhase]: {
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
    next: CommonGamePhases.DrawPhase,
  },
  [CommonGamePhases.DrawPhase]: {
    onBegin: G => {
      Object.entries(G.players).forEach(([playerId]) => {
        let numberOfCards = G.currentLevel
        while (numberOfCards > 0 && G.deck.length > 0) {
          G.players[playerId].hand.push(G.deck.pop() as number)
          numberOfCards--
        }
      })
      return G
    },
    onEnd: G => {
      const players = Object.values(G.players)
      players.forEach(({ hand }) => G.gameAnswer.push(...hand))
      G.gameAnswer = G.gameAnswer.sort((a, b) => a - b)
    },
    endIf: (G, { playOrder }) => {
      const players = Object.values(G.players)
      // end phase if every player has drawn their cards
      return (
        players.length === playOrder.length &&
        players.every(({ hand }) => hand.length === G.currentLevel)
      )
    },
    next: CommonGamePhases.PlayPhase,
  },
  [CommonGamePhases.PlayPhase]: {
    moves: {
      playCard: (G, ctx, cardValue: number) => {
        const playerID = ctx.playerID as string

        if (G.players[playerID].hand.includes(cardValue)) {
          // remove card from player's hand
          G.players[playerID].hand = G.players[playerID].hand.filter(
            removed => removed !== cardValue,
          )
          // add card into discard field
          G.discard.push(cardValue)
          const discardIndex = G.discard.length - 1

          // check answer sheet
          if (G.discard[discardIndex] !== G.gameAnswer[discardIndex]) {
            G.gameStatus = 'lose'
          }
          // check if all cards are played
          else if (Object.values(G.players).every(({ hand }) => hand.length === 0)) {
            G.gameStatus = 'win'
          }
        }
      },
    },
    endIf: G => {
      return G.gameStatus !== 'pending'
    },
    next: G => {
      if (G.gameStatus === 'win') {
        return CommonGamePhases.WinPhase
      }

      if (G.gameStatus === 'lose') {
        return CommonGamePhases.LosePhase
      }
    },
  },
  [CommonGamePhases.WinPhase]: {
    moves: {
      nextLevel: (G, { playOrder, random }) => {
        const players: { [key: string]: TheMindPlayer } = {}
        playOrder.forEach(playerId => {
          players[playerId] = {
            hand: [],
            isReady: false,
          }
        })

        G = {
          currentLevel: G.currentLevel + 1,
          gameStatus: 'pending',
          deck: random?.Shuffle(Array.from(Array(100).keys(), x => x + 1)) as number[],
          gameAnswer: [],
          discard: [],
          gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
          players,
        }
        return G
      },
    },
    endIf: G => {
      return G.gameStatus === 'pending'
    },
    next: CommonGamePhases.DrawPhase,
  },
  [CommonGamePhases.LosePhase]: {
    moves: {
      playAgain: (G, { playOrder, random }) => {
        const players: { [key: string]: TheMindPlayer } = {}
        playOrder.forEach(playerId => {
          players[playerId] = {
            hand: [],
            isReady: false,
          }
        })

        G = {
          currentLevel: 1,
          gameStatus: 'pending',
          deck: random?.Shuffle(Array.from(Array(100).keys(), x => x + 1)) as number[],
          gameAnswer: [],
          discard: [],
          gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
          players,
        }
        return G
      },
    },
    endIf: G => {
      return G.gameStatus === 'pending'
    },
    next: CommonGamePhases.DrawPhase,
  },
}

export const TheMind: Game<TheMindState> = {
  name: 'TheMind',
  setup: ({ playOrder, random }) => {
    const players: { [key: string]: TheMindPlayer } = {}
    playOrder.forEach(playerId => {
      players[playerId] = {
        hand: [],
        isReady: false,
      }
    })

    return {
      currentLevel: 1,
      gameStatus: 'pending',
      deck: random?.Shuffle(Array.from(Array(100).keys(), x => x + 1)) as number[],
      gameAnswer: [],
      discard: [],
      gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
      players,
    }
  },
  minPlayers: 2,
  maxPlayers: 10,
  phases,
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
}
