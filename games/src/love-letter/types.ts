import { CardName } from './utils'

export type LoveLetterStages = {
  BeginTurn: {
    moves: {
      stageCard: (cardName: CardName) => void
    }
  }
  Guard: {
    moves: {
      targetPlayer: (targetId: string) => void
    }
    next: 'GuardTarget'
  }
  GuardTarget: {
    moves: {
      guessCard: (payload: { targetId: string; guess: CardName }) => void
    }
    next: 'EndTurn'
  }
  Priest: {
    moves: {
      targetPlayer: (targetId: string) => void
    }
    next: 'PriestEffect'
  }
  PriestEffect: {
    moves: {
      proceed: () => void
    }
    next: 'EndTurn'
  }
  Baron: {
    moves: {
      targetPlayer: (targetId: string) => void
    }
    next: 'BaronEffect'
  }
  BaronEffect: {
    moves: {
      proceed: (targetId: string) => void
    }
    next: 'EndTurn'
  }
  BaronEffectForTarget: { moves: null }
  Prince: {
    moves: {
      targetPlayer: (targetId: string) => void
    }
    next: 'EndTurn'
  }
  King: {
    moves: {
      targetPlayer: (targetId: string) => void
    }
    next: 'EndTurn'
  }
  Princess: {
    moves: {
      proceed: () => void
    }
    next: 'EndTurn'
  }
  EndTurn: {
    moves: {
      endTurn: () => void
    }
  }
}

export type StageKey = keyof LoveLetterStages // e.g., 'Guard', 'Princess', etc.

export type StageType<K extends StageKey> = LoveLetterStages[K]

export type StageMoves<K extends StageKey> = StageType<K>['moves']
