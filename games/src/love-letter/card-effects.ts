import { Card, CardName, drawCard, getPlayer, LoveLetterState, playCard } from './utils'

export const invokeGuardEffect = (
  G: LoveLetterState,
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

export const invokePriestEffect = (
  G: LoveLetterState,
  currentPlayer: string,
  targetId: string,
) => {
  const player = getPlayer(G, currentPlayer)
  const target = getPlayer(G, targetId)

  player.priestData = {
    targetName: target.name || 'No name',
    targetCard: target.hand[0],
  }
}

export const compareHands = (G: LoveLetterState, currentPlayer: string, targetId: string) => {
  const player = getPlayer(G, currentPlayer)
  const target = getPlayer(G, targetId)

  const baronData = {
    playerName: player.name || 'No name',
    playerCard: player.hand[0],
    targetName: target.name || 'No name',
    targetCard: target.hand[0],
  }

  player.baronData = baronData
  target.baronData = baronData
}

export const clearBaronData = (G: LoveLetterState, playerID: string) => {
  const player = getPlayer(G, playerID)

  player.baronData = null
}

export const invokeBaronEffect = (
  G: LoveLetterState,
  currentPlayer: string,
  targetId: string,
) => {
  const player = getPlayer(G, currentPlayer)
  const target = getPlayer(G, targetId)

  const playerCardValue = player.hand[0].value
  const targetCardValue = target.hand[0].value

  const playerCardName = player.hand[0].name
  const targetCardName = target.hand[0].name

  player.baronData = null
  target.baronData = null

  if (playerCardValue > targetCardValue) {
    playCard(G, targetId, targetCardName)
    target.isActive = false
    return `${player.name} has the higher card; ${target.name} eliminated.`
  } else if (playerCardValue < targetCardValue) {
    playCard(G, currentPlayer, playerCardName)
    player.isActive = false
    return `${target.name} has the higher card; ${player.name} eliminated.`
  }

  return `Tied. No one eliminated.`
}

export const invokeHandmaidEffect = (G: LoveLetterState, currentPlayer: string) => {
  const player = getPlayer(G, currentPlayer)
  player.isProtected = true
}

export const invokePrinceEffect = (G: LoveLetterState, targetId: string) => {
  const target = getPlayer(G, targetId)
  const card = target.hand.pop() as Card
  target.discard.push(card)

  if (card?.name === 'Princess') {
    target.isActive = false
    return `${target.name} has Princess! ${target.name} is eliminated.`
  }

  drawCard(G, targetId)

  return `${target.name} discards their hand and draws new card.`
}

export const invokeKingEffect = (
  G: LoveLetterState,
  currentPlayer: string,
  targetId: string,
) => {
  const player = getPlayer(G, currentPlayer)
  const target = getPlayer(G, targetId)

  const playerCard = player.hand.pop() as Card
  const targetCard = target.hand.pop() as Card

  player.hand.push(targetCard)
  target.hand.push(playerCard)

  return `${player.name} & ${target.name} traded hands.`
}
