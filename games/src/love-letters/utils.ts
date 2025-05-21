import { MultiplayerGamePlayer, MultiplayerGameWithLobbyState } from '../types'

export type CardName =
  | 'Guard'
  | 'Priest'
  | 'Baron'
  | 'Handmaid'
  | 'Prince'
  | 'King'
  | 'Countess'
  | 'Princess'

export type Card = {
  name: CardName
  value: number
  count: number
}

export type LoveLettersPlayer = MultiplayerGamePlayer & {
  name?: string
  id: string
  hand: Card[]
  discard: Card[]
  isProtected: boolean
  isActive: boolean
}

export type LoveLettersState = MultiplayerGameWithLobbyState<LoveLettersPlayer> & {
  deck: Card[]
  message: string | null
}

export type EffectFn = (
  currentPlayerId: string,
  targetPlayerId: string,
  gameState: LoveLettersState,
) => LoveLettersState | boolean | void

export function createDeck(): Card[] {
  const baseCards: { name: CardName; value: number; count: number }[] = [
    { name: 'Guard', value: 1, count: 5 },
    { name: 'Priest', value: 2, count: 2 },
    { name: 'Baron', value: 3, count: 2 },
    { name: 'Handmaid', value: 4, count: 2 },
    { name: 'Prince', value: 5, count: 2 },
    { name: 'King', value: 6, count: 1 },
    { name: 'Countess', value: 7, count: 1 },
    { name: 'Princess', value: 8, count: 1 },
  ]

  const cards: Card[] = []
  for (const { name, value, count } of baseCards) {
    for (let i = 0; i < count; i++) {
      cards.push({ name, value, count })
    }
  }

  return shuffle(cards)
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}

export const drawCard = (G: LoveLettersState, currentPlayer: string) => {
  if (G.deck.length) {
    G.players[currentPlayer].hand.push(G.deck.pop() as Card)
  }
}

export const playCard = (G: LoveLettersState, currentPlayer: string) => {
  const discard = G.players[currentPlayer].discard
  const hand = G.players[currentPlayer].hand
  discard.push(hand.pop() as Card)
}

export const invokeGuardEffect = (
  G: LoveLettersState,
  payload: { currentPlayer: string; targetId: string; guess: CardName },
) => {
  const { targetId, guess } = payload

  const hasCard = !!G.players[targetId].hand.find(({ name }) => name === guess)

  if (hasCard) {
    G.players[targetId].isActive = false
    return true
  }

  return false
}

export const broadcastMessage = (gameState: LoveLettersState, message: string) => {
  gameState.message = message
}

export const getPlayerName = (gameState: LoveLettersState, id: string) =>
  gameState.players[id].name

export const getPlayer = (gameState: LoveLettersState, id: string) => gameState.players[id]
