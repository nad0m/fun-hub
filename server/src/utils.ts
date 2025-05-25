type PlayerMetadata = {
  name?: string;
  credentials?: string;
  isConnected?: boolean;
};

/**
 * Given players, returns the count of players.
 */
export const getNumPlayers = (players: PlayerMetadata): number =>
  Object.keys(players).length;

/**
 * Given players, tries to find the ID of the first player that can be joined.
 * Returns `undefined` if there’s no available ID.
 */
export const getFirstAvailablePlayerID = (
  players: PlayerMetadata
): string | undefined => {
  const numPlayers = getNumPlayers(players);
  // Try to get the first index available
  for (let i = 0; i < numPlayers; i++) {
    if (typeof players[i].name === 'undefined' || players[i].name === null) {
      return String(i);
    }
  }
};
