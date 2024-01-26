import { LobbyAPI } from 'boardgame.io';
import { LobbyClient } from 'boardgame.io/client';

const SERVER_URL = import.meta.env.VITE_ATOM_SOCKET_API;
const FORCE_DELAY_MS = 1000;

export interface Player {
  id: number;
  name?: string;
}

export interface RoomMetadata {
  players: Player[];
}

export interface ActiveRoomPlayer {
  playerID: number;
  credential: string;
}

export interface JoinRoomParams {
  roomID: string;
  playerID: number;
  playerName: string;
}

const lobbyClient = new LobbyClient({ server: SERVER_URL });

export const createMatch = async ({
  gameId,
  numPlayers,
}: {
  gameId: string;
  numPlayers: number;
}): Promise<string> => {
  await new Promise((resolve) => {
    setTimeout(resolve, FORCE_DELAY_MS);
  });

  const data = await lobbyClient.createMatch(gameId, { numPlayers });

  return data.matchID;
};

export const getMatch = async (
  gameID: string,
  matchID: string
): Promise<LobbyAPI.Match> => {
  await new Promise((resolve) => {
    setTimeout(resolve, FORCE_DELAY_MS);
  });

  const data = await lobbyClient.getMatch(gameID, matchID);

  return data;
};

export const joinMatch = async ({
  gameID,
  matchID,
  playerName,
}: {
  gameID: string;
  matchID: string;
  playerName: string;
}): Promise<LobbyAPI.JoinedMatch> => {
  // is this for testing, or needed?
  await new Promise((resolve) => {
    setTimeout(resolve, FORCE_DELAY_MS);
  });

  const data = await lobbyClient.joinMatch(gameID, matchID, { playerName });

  return data;
};

export const leaveMatch = async ({
  gameID,
  matchID,
  playerID,
  credentials,
}: {
  gameID: string;
  matchID: string;
  playerID: string;
  credentials: string;
}): Promise<void> => {
  await lobbyClient.leaveMatch(gameID, matchID, { playerID, credentials });
};

export const getMatchMetadata = async (
  gameID: string,
  matchID: string
): Promise<LobbyAPI.Match> => {
  const matchMetadata = await lobbyClient.getMatch(gameID, matchID);

  return matchMetadata;
};

export const forcePlayMatch = async (payload: {
  playerID: string;
  credentials: string;
  matchID: string;
}): Promise<LobbyAPI.Match> => {
  await new Promise((resolve) => {
    setTimeout(resolve, FORCE_DELAY_MS);
  });
  const response = await fetch(`${SERVER_URL}/force-play`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

// async joinRoom({ roomID, ...json }: JoinRoomParams): Promise<{ playerCredentials: string }> {
//   const { playerCredentials } = await this.api
//     .post(`${roomID}/join`, {
//       json,
//     })
//     .json<{ playerCredentials: string }>();

//   return {
//     playerCredentials,
//   };
// }

// async getRoomMetadata(roomID: string): Promise<RoomMetadata> {
//   const roomMetadata = await this.api.get(roomID).json<{ players: Player[] }>();
//   return roomMetadata;
// }
