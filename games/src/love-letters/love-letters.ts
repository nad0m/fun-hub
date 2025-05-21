import { ActivePlayers } from 'boardgame.io/core'
import { Ctx, Game, PhaseMap } from 'boardgame.io'
import { CommonGamePhases } from '../types'
import {
  broadcastMessage,
  Card,
  CardName,
  createDeck,
  drawCard,
  getPlayer,
  getPlayerName,
  invokeGuardEffect,
  LoveLettersPlayer,
  LoveLettersState,
  playCard,
} from './utils'

const phases: PhaseMap<LoveLettersState, Ctx> = {
  [CommonGamePhases.PlayPhase]: {
    turn: {
      onBegin: (G, { events, currentPlayer }) => {
        events?.setActivePlayers({
          currentPlayer: 'BeginTurn',
        })
        const name = getPlayerName(G, currentPlayer)
        broadcastMessage(G, `${name}'s turn...`)
      },
      stages: {
        BeginTurn: {
          moves: {
            stageCard: (G, { currentPlayer, playerID, events }, cardName: CardName) => {
              if (currentPlayer !== playerID) {
                return
              }

              const playerName = getPlayerName(G, currentPlayer)
              broadcastMessage(G, `${playerName} plays ${cardName}. Choosing target...`)

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

              playCard(G, currentPlayer)

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
        Priest: {},
        Baron: {},
        Handmaid: {},
        Prince: {},
        King: {},
        Countess: {},
        Princess: {},
        EndTurn: {
          moves: {
            endTurn: (G, { currentPlayer, events }) => {
              drawCard(G, currentPlayer)
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
export const LoveLetters: Game<LoveLettersState> = {
  name: 'LoveLetters',
  setup: ({ playOrder }) => {
    const players: { [key: string]: LoveLettersPlayer } = {}
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
