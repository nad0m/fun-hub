import { Ctx } from 'boardgame.io'
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
  target?: string | null
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
  winner: LoveLetterPlayer | null
}

export type EffectFn = (
  currentPlayerId: string,
  targetPlayerId: string,
  gameState: LoveLetterState,
) => LoveLetterState | boolean | void

export const BaseCards: { name: CardName; value: number; count: number }[] = [
  { name: 'Guard', value: 1, count: 7 },
  { name: 'Priest', value: 2, count: 3 },
  { name: 'Baron', value: 3, count: 3 },
  { name: 'Handmaid', value: 4, count: 3 },
  { name: 'Prince', value: 5, count: 3 },
  { name: 'King', value: 6, count: 2 },
  { name: 'Countess', value: 7, count: 1 },
  { name: 'Princess', value: 8, count: 1 },
]

export function createDeck(): Card[] {
  const cards: Card[] = []
  for (const { name, value, count } of BaseCards) {
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
  const hasTargets = others.some(player => !player.isProtected && player.isActive)

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

export const resetGame = (G: LoveLetterState, ctx: Ctx) => {
  G.deck = createDeck()
  ctx.playOrder.forEach(playerId => {
    G.players[playerId].hand = []
    G.players[playerId].discard = []
    G.players[playerId].isActive = true
    G.players[playerId].target = null
    G.players[playerId].priestData = null
    G.players[playerId].baronData = null
    G.players[playerId].isProtected = false
    G.players[playerId].isReady = false
    drawCard(G, playerId)
  })
}

export const getHighestHand = (G: LoveLetterState) => {
  const activePlayers = Object.values(G.players).filter(({ isActive }) => isActive)

  let winner = activePlayers[0]
  const isTie = activePlayers.every(({ hand }) => hand[0].value === winner.hand[0].value)

  if (isTie) {
    return `Game tied!`
  }

  activePlayers.forEach(player => {
    if (player.hand[0].value > winner.hand[0].value) {
      winner = player
    }
  })

  return `${winner.name} wins with the highest card in hand!`
}
