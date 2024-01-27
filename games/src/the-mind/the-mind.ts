import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { ActivePlayers } from 'boardgame.io/core'

export type GameStatus = 'pending' | 'win' | 'lose'

export type TheMindPlayer = {
  name: string | null
  hand: number[]
  isReady: boolean
}

export type TheMindState = {
  currentLevel: number
  gameStatus: GameStatus
  deck: number[]
  discard: number[]
  gameStartTimer: number
  players: { [key: string]: TheMindPlayer }
}

export type TheMindPhases = typeof phases

const GAME_START_COUNTDOWN_SECONDS = 3

const isInAscendingOrder = (arr: number[]) => {
  if (arr.length <= 1) {
    return true // An array with 0 or 1 element is always considered in order
  }

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false
    }
  }
  return true
}

const isTeamVictory = (G: TheMindState) => {
  const noCardsLeft = Object.values(G.players).every(({ hand }) => hand.length === 0)
  const validDiscardPile = isInAscendingOrder(G.discard)

  return noCardsLeft && validDiscardPile
}

const phases: PhaseMap<TheMindState, Ctx> = {
  readyUpPhase: {
    onBegin: (G, ctx) => {
      G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
    },
    moves: {
      toggleReady: (G, ctx) => {
        G.players[ctx.playerID as string].isReady = !G.players[ctx.playerID as string].isReady

        if (!G.players[ctx.playerID as string].isReady) {
          G.gameStartTimer = GAME_START_COUNTDOWN_SECONDS
        }
      },
      countDownToTransition: (G, ctx) => {
        G.gameStartTimer -= 1
      },
    },
    endIf: (G, ctx) => {
      return G.gameStartTimer === 0
    },
    start: true,
    next: 'drawPhase',
  },
  drawPhase: {
    onBegin: (G, { playOrder, events, playerID, ...rest }) => {
      Object.entries(G.players).forEach(([playerId, name]) => {
        let numberOfCards = G.currentLevel
        while (numberOfCards > 0) {
          G.players[playerId].hand.push(G.deck.pop() as number)
          numberOfCards--
        }
      })
      return G
    },
    onEnd: (G, ctx) => {},
    endIf: (G, { playOrder, ...ctx }) => {
      const players = Object.values(G.players)
      // end phase if every player has drawn their cards
      return (
        players.length === playOrder.length &&
        players.every(({ hand }) => hand.length === G.currentLevel)
      )
    },
    next: 'playPhase',
  },
  playPhase: {
    moves: {
      playCard: (G, ctx, cardValue: number) => {
        const playerID = ctx.playerID as string

        if (G.players[playerID].hand.includes(cardValue)) {
          G.discard.push(cardValue)
          G.players[playerID].hand = G.players[playerID].hand.filter(
            removed => removed !== cardValue,
          )
        }
      },
    },
    endIf: G => {
      const win = isTeamVictory(G)
      const lose = !isInAscendingOrder(G.discard)

      if (win) {
        G.gameStatus = 'win'
      }

      if (lose) {
        G.gameStatus = 'lose'
      }

      return win || lose
    },

    next: G => {
      if (G.gameStatus === 'win') {
        return 'winPhase'
      }

      if (G.gameStatus === 'lose') {
        return 'losePhase'
      }
    },
  },
  winPhase: {},
  losePhase: {},
}

export const TheMind: Game<TheMindState> = {
  name: 'TheMind',
  setup: ({ playOrder, random }) => {
    const players: { [key: string]: TheMindPlayer } = {}
    playOrder.forEach(playerId => {
      players[playerId] = {
        name: null,
        hand: [],
        isReady: false,
      }
    })

    return {
      currentLevel: 1,
      gameStatus: 'pending',
      deck: random?.Shuffle(Array.from(Array(100).keys(), x => x + 1)) as number[],
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