export type MultiplayerGamePlayer = {
  name: string
  isReady: boolean
}

/**
 * Any generic game with generic players, that has `gameStartTimer` and `players` obj.
 * This should cover 99% of multiplayer games with lobbies.
 */
export type MultiplayerGameWithLobbyState<
  GamePlayer extends MultiplayerGamePlayer = MultiplayerGamePlayer,
> = {
  gameStartTimer: number
  players: { [key: string]: GamePlayer & MultiplayerGamePlayer }
}

export enum CommonGamePhases {
  ReadyUpPhase = 'READY_UP_PHASE',
  PlayPhase = 'PLAY_PHASE',
  DrawPhase = 'DRAW_PHASE',
  WinPhase = 'WIN_PHASE',
  LosePhase = 'LOSE_PHASE',
}
