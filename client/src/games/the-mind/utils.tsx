import { FilteredMetadata, LogEntry } from 'boardgame.io';

export const parseLogEntry = (
  logEntry: LogEntry,
  players: FilteredMetadata | undefined
): string | null => {
  const { type, playerID, args } = logEntry.action.payload;
  const player = players?.find((found) => found.id === parseInt(playerID));
  const playerName = player?.name || `Player ${player?.id}`;

  switch (type) {
    case 'playCard':
      return `${playerName} played (${args.toString()})`;
    default:
      return null;
  }
};
