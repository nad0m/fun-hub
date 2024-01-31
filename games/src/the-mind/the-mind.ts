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
  gameAnswer: number[]
  discard: number[]
  gameStartTimer: number
  players: { [key: string]: TheMindPlayer }
}

export type TheMindPhases = typeof phases

const GAME_START_COUNTDOWN_SECONDS = 3

const phases: PhaseMap<TheMindState, Ctx> = {
  readyUpPhase: {
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
    next: 'drawPhase',
  },
  drawPhase: {
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
    next: 'playPhase',
  },
  playPhase: {
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
        return 'winPhase'
      }

      if (G.gameStatus === 'lose') {
        return 'losePhase'
      }
    },
  },
  winPhase: {
    moves: {
      nextLevel: (G, { playOrder, random }) => {
        console.log(G)
        const players: { [key: string]: TheMindPlayer } = {}
        playOrder.forEach(playerId => {
          players[playerId] = {
            name: null,
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
    next: 'drawPhase',
  },
  losePhase: {
    moves: {
      playAgain: (G, { playOrder, random }) => {
        const players: { [key: string]: TheMindPlayer } = {}
        playOrder.forEach(playerId => {
          players[playerId] = {
            name: null,
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
    next: 'drawPhase',
  },
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
