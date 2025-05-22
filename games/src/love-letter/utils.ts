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

export type PriestData = {
  targetName: string
  targetCard: Card
}

export type BaronData = {
  playerName: string
  playerCard: Card
  targetName: string
  targetCard: Card
}

export type LoveLetterPlayer = MultiplayerGamePlayer & {
  name?: string
  id: string
  hand: Card[]
  discard: Card[]
  isProtected: boolean
  isActive: boolean
  priestData: PriestData | null
  baronData: BaronData | null
}

export type LoveLetterState = MultiplayerGameWithLobbyState<LoveLetterPlayer> & {
  deck: Card[]
  message: string | null
}

export type EffectFn = (
  currentPlayerId: string,
  targetPlayerId: string,
  gameState: LoveLetterState,
) => LoveLetterState | boolean | void

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

export const drawCard = (G: LoveLetterState, currentPlayer: string) => {
  if (G.deck.length) {
    G.players[currentPlayer].hand.push(G.deck.pop() as Card)
  }
}

export const playCard = (G: LoveLetterState, currentPlayer: string, cardName: string) => {
  const discard = G.players[currentPlayer].discard
  const hand = G.players[currentPlayer].hand
  const card = findAndRemove(hand, cardName)

  if (card) {
    discard.push(card)
  }
}

export const checkTargets = (G: LoveLetterState, currentPlayer: string) => {
  const others = Object.values(G.players).filter(({ id }) => id !== currentPlayer)
  const hasTargets = others.some(player => !player.isProtected)

  return hasTargets
}

export const broadcastMessage = (gameState: LoveLetterState, message: string) => {
  gameState.message = message
}

export const getPlayerName = (gameState: LoveLetterState, id: string) =>
  gameState.players[id].name

export const getPlayer = (gameState: LoveLetterState, id: string) => gameState.players[id]

export function findAndRemove(hand: Card[], cardName: string): Card | undefined {
  const index = hand.findIndex(card => card.name === cardName)
  if (index !== -1) {
    return hand.splice(index, 1)[0] // remove and return the found item
  }
  return undefined
}

export const targetIsProtected = (G: LoveLetterState, targetId: string) => {
  return getPlayer(G, targetId).isProtected
}
