import { ActivePlayers } from 'boardgame.io/core'
import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { CommonGamePhases, GAME_START_COUNTDOWN_SECONDS } from '../types'
import {
  broadcastMessage,
  Card,
  CardName,
  checkTargets,
  createDeck,
  drawCard,
  getHighestHand,
  getPlayer,
  getPlayerName,
  LoveLetterPlayer,
  LoveLetterState,
  playCard,
  resetGame,
  targetIsProtected,
} from './utils'
import {
  compareHands,
  invokeBaronEffect,
  invokeGuardEffect,
  invokeHandmaidEffect,
  invokeKingEffect,
  invokePriestEffect,
  invokePrinceEffect,
} from './card-effects'

const phases: PhaseMap<LoveLetterState, Ctx> = {
  [CommonGamePhases.ReadyUpPhase]: {
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
    onEnd: resetGame,
    start: true,
    next: CommonGamePhases.PlayPhase,
  },
  [CommonGamePhases.PlayPhase]: {
    turn: {
      onBegin: (G, { events, currentPlayer }) => {
        const players = Object.values(G.players)
        const activePlayers = players.filter(({ isActive }) => isActive)

        if (activePlayers.length === 1) {
          broadcastMessage(G, `${activePlayers[0].name} won the round! Rematch?`)
          activePlayers[0].wins++
          G.winner = activePlayers[0].id
          events?.endPhase()
          return
        }

        const player = getPlayer(G, currentPlayer)

        if (!player.isActive) {
          events?.endTurn()
          return
        }

        if (G.deck.length === 0) {
          const message = getHighestHand(G)
          broadcastMessage(G, `No more cards in the deck.\n${message}`)
          events?.endPhase()
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
              const player = getPlayer(G, currentPlayer)

              // check for countess
              if (
                (cardName === 'Prince' || cardName === 'King') &&
                player.hand.some(({ name }) => name === 'Countess')
              ) {
                return
              }

              playCard(G, currentPlayer, cardName)

              // check for valid targets
              if (
                cardName === 'Guard' ||
                cardName === 'Priest' ||
                cardName === 'Baron' ||
                cardName === 'King'
              ) {
                const hasTargets = checkTargets(G, currentPlayer)

                if (!hasTargets) {
                  broadcastMessage(
                    G,
                    `${player.name} discards ${cardName}; all targets are protected.`,
                  )
                  events?.setActivePlayers({
                    currentPlayer: {
                      stage: 'EndTurn',
                    },
                  })
                  return
                }
              }

              // check if princess is played
              if (cardName === 'Princess') {
                player.isActive = false
                broadcastMessage(
                  G,
                  `${player.name} plays ${cardName}. ${player.name} is eliminated.`,
                )
                events?.setActivePlayers({
                  currentPlayer: {
                    stage: 'EndTurn',
                  },
                })
                return
              }

              broadcastMessage(G, `${player.name} plays ${cardName}...`)

              // do nothing if countess is played
              if (cardName === 'Countess') {
                events?.setActivePlayers({
                  currentPlayer: {
                    stage: 'EndTurn',
                  },
                })
                return
              }

              // check if handmaid is played
              if (cardName === 'Handmaid') {
                invokeHandmaidEffect(G, currentPlayer)
                const playerName = getPlayerName(G, currentPlayer)
                broadcastMessage(G, `${playerName} is protected until their next round.`)
                events?.setActivePlayers({
                  currentPlayer: {
                    stage: 'EndTurn',
                  },
                })
                return
              }

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
              if (targetIsProtected(G, targetId)) {
                return
              }

              const player = getPlayer(G, currentPlayer)
              const target = getPlayer(G, targetId)

              player.target = target.id

              broadcastMessage(G, `${player.name} targets ${target.name}. Guessing card...`)

              events?.endStage()
            },
          },
          next: 'GuardTarget',
        },
        GuardTarget: {
          moves: {
            guessCard: (G, { currentPlayer, events }, guess: CardName) => {
              const player = getPlayer(G, currentPlayer)

              const success = invokeGuardEffect(G, {
                currentPlayer,
                targetId: player.target as string,
                guess,
              })

              broadcastMessage(
                G,
                `${player.name} guesses ${guess}. ${success ? 'Correct!' : 'Wrong!'}`,
              )

              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Priest: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId) => {
              if (targetIsProtected(G, targetId)) {
                return
              }

              const player = getPlayer(G, currentPlayer)
              const target = getPlayer(G, targetId)

              player.target = target.id

              broadcastMessage(G, `${player.name} targets ${target.name}. Viewing card...`)

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
              player.target = null

              events?.endTurn()
            },
          },
        },
        Baron: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId: string) => {
              if (targetIsProtected(G, targetId)) {
                return
              }

              const player = getPlayer(G, currentPlayer)
              const target = getPlayer(G, targetId)

              player.target = target.id

              broadcastMessage(G, `${player.name} targets ${target.name}. Comparing hands...`)

              compareHands(G, currentPlayer, targetId)

              events?.setActivePlayers({
                value: {
                  [currentPlayer]: 'BaronEffect',
                  [targetId]: 'BaronEffectForTarget',
                },
              })
            },
          },
        },
        BaronEffect: {
          moves: {
            proceed: (G, { events, currentPlayer }) => {
              const player = getPlayer(G, currentPlayer)
              const message = invokeBaronEffect(G, currentPlayer, player.target as string)
              broadcastMessage(G, message)

              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        Prince: {
          moves: {
            targetPlayer: (G, { events }, targetId: string) => {
              if (targetIsProtected(G, targetId)) {
                return
              }

              const message = invokePrinceEffect(G, targetId)

              broadcastMessage(G, message)
              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        King: {
          moves: {
            targetPlayer: (G, { events, currentPlayer }, targetId: string) => {
              if (targetIsProtected(G, targetId)) {
                return
              }

              const message = invokeKingEffect(G, currentPlayer, targetId)

              broadcastMessage(G, message)
              events?.endStage()
            },
          },
          next: 'EndTurn',
        },
        EndTurn: {
          moves: {
            endTurn: (G, { events, currentPlayer }) => {
              getPlayer(G, currentPlayer).target = null
              events?.endTurn()
            },
          },
        },
      },
    },
    next: CommonGamePhases.WinPhase,
  },
  [CommonGamePhases.WinPhase]: {
    moves: {
      restart: (G, { playerID }) => {
        getPlayer(G, playerID as string).isReady = true
      },
    },

    endIf: G => {
      const players = Object.values(G.players)
      return players.every(({ isReady }) => isReady)
    },
    onEnd: resetGame,
    next: CommonGamePhases.PlayPhase,
  },
}

export const LoveLetter: Game<LoveLetterState> = {
  name: 'LoveLetter',
  setup: ({ playOrder, numPlayers }) => {
    const players: { [key: string]: LoveLetterPlayer } = {}
    const deck = createDeck(numPlayers)

    playOrder.forEach((playerId, idx) => {
      players[playerId] = {
        id: playerId,
        isReady: false,
        name: `Player ${idx + 1}`,
        hand: [deck.pop() as Card],
        target: null,
        discard: [],
        isActive: true,
        isProtected: false,
        priestData: null,
        baronData: null,
        wins: 0,
      }
    })

    return {
      players,
      deck,
      gameStartTimer: GAME_START_COUNTDOWN_SECONDS,
      message: [],
      winner: null,
    }
  },
  minPlayers: 2,
  maxPlayers: 6,
  phases,
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
}
