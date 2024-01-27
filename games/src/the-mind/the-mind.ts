import { Ctx, Game, PhaseMap } from 'boardgame.io'

export type TheMindPlayer = {
  name: string
  hand: number[]
  isReady: boolean
}

export type TheMindState = {
  currentLevel: number
  deck: number[]
  discard: number[]
  players: { [key: string]: TheMindPlayer }
}

export type TheMindPhases = typeof phases

const phases: PhaseMap<TheMindState, Ctx> = {
  readyUpPhase: {
    turn: {
      onBegin: (G, ctx) => {
        ctx.events!.setActivePlayers(ctx.playOrder)
      },
    },
    moves: {
      toggleReady: (G, ctx) => {
        G.players[ctx.playerID!].isReady = !G.players[ctx.playerID!].isReady
      },
    },
    endIf: G => {
      return Object.values(G.players).every(({ isReady }) => isReady)
    },
    start: true,
    next: 'toDrawPhaseTransition',
  },
  toDrawPhaseTransition: {
    onBegin: (G, ctx) => {
      setTimeout(function () {
        ctx.events!.endPhase()
      }, 5000)
    },
    next: 'drawPhase',
  },
  drawPhase: {
    onBegin: G => {
      Object.entries(G.players).forEach(([playerId]) => {
        let numberOfCards = G.currentLevel
        while (numberOfCards > 0) {
          G.players[playerId].hand.push(G.deck.pop() as number)
          numberOfCards--
        }
      })
      return G
    },
    onEnd: () => {},
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
  playPhase: {},
}

export const TheMind: Game<TheMindState> = {
  name: 'TheMind',
  setup: ({ playOrder, random }) => {
    const players: { [key: string]: TheMindPlayer } = {}
    playOrder.forEach(playerId => {
      players[playerId] = {
        name: '',
        hand: [],
        isReady: false,
      }
    })

    return {
      currentLevel: 1,
      deck: random?.Shuffle(Array.from(Array(100).keys(), x => x + 1)) as number[],
      discard: [],
      players,
    }
  },
  minPlayers: 2,
  maxPlayers: 10,
  phases,
  turn: {
    minMoves: 1,
    maxMoves: 1,
  },
}
