import { ActivePlayers } from 'boardgame.io/core'
import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { CommonGamePhases } from '../types'
import {
  broadcastMessage,
  Card,
  CardName,
  checkTargets,
  createDeck,
  drawCard,
  getPlayer,
  getPlayerName,
  LoveLetterPlayer,
  LoveLetterState,
  playCard,
} from './utils'
import {
  compareHands,
  invokeBaronEffect,
  invokeGuardEffect,
  invokeHandmaidEffect,
  invokePriestEffect,
} from './card-effects'

const phases: PhaseMap<LoveLetterState, Ctx> = {
  [CommonGamePhases.PlayPhase]: {
    turn: {
      onBegin: (G, { events, currentPlayer }) => {
        const player = getPlayer(G, currentPlayer)

        if (!player.isActive) {
          events?.endTurn()
          return
        }

        drawCard(G, currentPlayer)
        player.isProtected = false
        broadcastMessage(G, `${player.name}'s turn...`)

        events?.setActivePlayers({
          currentPlayer: 'BeginTurn',
        })
      },
      stages: {
        BeginTurn: {
          moves: {
            stageCard: (G, { currentPlayer, playerID, events }, cardName: CardName) => {
              if (currentPlayer !== playerID) {
                return
              }

              const playerName = getPlayerName(G, currentPlayer)
              playCard(G, currentPlayer, cardName)

              if (cardName === 'Guard' || cardName === 'Priest' || cardName === 'Baron') {
                const hasTargets = checkTargets(G, currentPlayer)

                broadcastMessage(
                  G,
                  `${playerName} discards ${cardName}; all targets are protected.`,
                )

                if (!hasTargets) {
                  events?.setActivePlayers({
                    currentPlayer: {
                      stage: 'EndTurn',
                    },
                  })
                  return
                }
              }

              broadcastMessage(G, `${playerName} plays ${cardName}...`)
              events?.setActivePlayers({
                currentPlayer: {
                  stage: cardName,
                },
              })
            },
          },
        },
        Guard: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId: string) => {
              const playerName = getPlayerName(G, currentPlayer)
              const { name: targetName, isProtected } = getPlayer(G, targetId)

              if (isProtected) {
                return
              }

              broadcastMessage(G, `${playerName} targets ${targetName}. Guessing card...`)

              events?.endStage()
            },
          },
          next: 'GuardTarget',
        },
        GuardTarget: {
          moves: {
            guessCard: (
              G,
              { currentPlayer, events },
              payload: { targetId: string; guess: CardName },
            ) => {
              const playerName = getPlayerName(G, currentPlayer)
              const { targetId, guess } = payload

              const success = invokeGuardEffect(G, { currentPlayer, targetId, guess })

              broadcastMessage(
                G,
                `${playerName} guesses ${guess}. ${success ? 'Correct!' : 'Wrong!'}`,
              )

              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Priest: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId) => {
              const playerName = getPlayerName(G, currentPlayer)
              const { name: targetName, isProtected } = getPlayer(G, targetId)

              if (isProtected) {
                return
              }

              broadcastMessage(G, `${playerName} targets ${targetName}. Viewing card...`)

              invokePriestEffect(G, currentPlayer, targetId)

              events?.endStage()
            },
          },
          next: 'PriestEffect',
        },
        PriestEffect: {
          moves: {
            proceed: (G, { events, currentPlayer }) => {
              const player = getPlayer(G, currentPlayer)
              player.priestData = null

              broadcastMessage(G, 'Proceeding...')

              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Baron: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId: string) => {
              const playerName = getPlayerName(G, currentPlayer)
              const targetName = getPlayerName(G, targetId)

              const { isProtected } = getPlayer(G, targetId)

              if (isProtected) {
                return
              }

              broadcastMessage(G, `${playerName} targets ${targetName}. Comparing hands...`)

              compareHands(G, currentPlayer, targetId)

              events?.endStage()
            },
          },
          next: 'BaronEffect',
        },
        BaronEffect: {
          moves: {
            proceed: (G, { events, currentPlayer }, targetId: string) => {
              const message = invokeBaronEffect(G, currentPlayer, targetId)
              broadcastMessage(G, message)
              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Handmaid: {
          moves: {
            proceed: (G, { events, currentPlayer }) => {
              invokeHandmaidEffect(G, currentPlayer)
              const playerName = getPlayerName(G, currentPlayer)
              broadcastMessage(G, `${playerName} is protected until their next round.`)
              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Prince: {
          moves: {},
        },
        King: {},
        Countess: {},
        Princess: {},
        EndTurn: {
          moves: {
            endTurn: (_G, { events }) => {
              events?.endTurn()
            },
          },
        },
      },
    },

    endIf: () => {
      // const players = Object.values(G.players)
      // // end phase if every player has drawn their cards
      // return (
      //   players.length === playOrder.length &&
      //   players.every(({ hand }) => hand.length === 1)
      // )
    },
    start: true,
  },
}

export const LoveLetter: Game<LoveLetterState> = {
  name: 'LoveLetter',
  setup: ({ playOrder }) => {
    const players: { [key: string]: LoveLetterPlayer } = {}
    const deck = createDeck()

    playOrder.forEach((playerId, idx) => {
      players[playerId] = {
        id: playerId,
        name: `Player ${idx}`,
        hand: [deck.pop() as Card],
        discard: [],
        isReady: false,
        isActive: true,
        isProtected: false,
        priestData: null,
        baronData: null,
      }
    })

    return {
      players,
      deck,
      gameStartTimer: 1,
      message: null,
    }
  },
  minPlayers: 2,
  maxPlayers: 4,
  phases,
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  // plugins: [
  //   {
  //     name: "gameEngine",
  //     api: ({ ctx }) => {
  //       return new GameEngine(ctx)
  //     }
  //   }
  // ]
}
