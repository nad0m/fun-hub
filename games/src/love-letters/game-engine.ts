import { Card, createDeck, LoveLettersPlayer } from './utils'

export class GameEngine {
  players: LoveLettersPlayer[]
  deck: Card[]
  discardPile: Card[] = []
  currentPlayerIndex = 0
  removedCard: Card

  // constructor(playerCount: number) {
  //   if (playerCount < 2 || playerCount > 4) throw new Error('Player count must be 2-4')
  //   this.deck = createDeck()
  //   this.removedCard = this.deck.pop()!
  //   this.players = Array.from({ length: playerCount }, (_, i) => new Player(i))

  //   // Deal 1 card to each player
  //   this.players.forEach(p => p.hand.push(this.deck.pop()!))
  // }

  // eliminatePlayer(index: number) {
  //   this.players[index].isActive = false
  //   this.players[index].hand = []
  // }

  // drawCard(playerIndex: number): Card | null {
  //   if (this.deck.length === 0) return null
  //   const card = this.deck.pop()!
  //   this.players[playerIndex].hand.push(card)
  //   return card
  // }

  // playCard(
  //   playerIndex: number,
  //   cardIndex: 0 | 1,
  //   targetIndex: number | null,
  //   guessedCard?: string,
  // ) {
  //   const player = this.players[playerIndex]
  //   const card = player.hand.splice(cardIndex, 1)[0]

  //   if (
  //     card.name === 'Countess' &&
  //     player.hand[0] &&
  //     (player.hand[0].name === 'King' || player.hand[0].name === 'Prince')
  //   ) {
  //     throw new Error('Must play Countess when holding King or Prince')
  //   }

  //   this.discardPile.push(card)
  //   card.effect(playerIndex, targetIndex, this)
  // }

  // nextTurn() {
  //   let next = (this.currentPlayerIndex + 1) % this.players.length
  //   while (!this.players[next].isActive) {
  //     next = (next + 1) % this.players.length
  //   }
  //   this.currentPlayerIndex = next
  //   // this.players[next].resetTurn()
  //   this.drawCard(next)
  // }

  // isGameOver(): boolean {
  //   const activePlayers = this.players.filter(p => p.isActive)
  //   return activePlayers.length <= 1 || this.deck.length === 0
  // }

  // getWinner(): number | null {
  //   const active = this.players.filter(p => p.isActive)
  //   if (active.length === 1) return active[0].id
  //   const maxValue = Math.max(...active.map(p => p.hand[0]?.value ?? 0))
  //   const winner = active.find(p => p.hand[0]?.value === maxValue)
  //   return winner?.id ?? null
  // }
}
