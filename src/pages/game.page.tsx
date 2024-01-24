import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useIsMounted, useLocalStorage } from 'usehooks-ts';
import { LobbyAPI } from 'boardgame.io';
import { PlayerRegister } from 'components/player-register';
import { joinMatch } from 'services/lobby-service';
import { isNonEmptyString, validatePlayerData } from 'utils/validators';
import { GameClient, GamePageProps } from 'types';

const useGetPlayerData = ({
  playerName,
  gameID,
  matchID,
}: {
  playerName: string;
  gameID: string;
  matchID: string;
}): {
  playerData: LobbyAPI.JoinedMatch | null;
  isLoading: boolean;
  hasError: boolean;
} => {
  const isMounted = useIsMounted();

  const [cachedPlayerData, setCachedPlayerData] =
    useLocalStorage<LobbyAPI.JoinedMatch | null>(matchID, null);

  const hasValidCachedPlayerData = validatePlayerData(cachedPlayerData);

  const shouldEnableJoinQuery =
    isNonEmptyString(playerName) && !hasValidCachedPlayerData;

  const {
    data: fetchedPlayerData = null,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['joinMatch', { gameID, matchID, playerName }],
    queryFn: () => joinMatch({ gameID, matchID, playerName }),
    enabled: shouldEnableJoinQuery,
  });

  const playerData = hasValidCachedPlayerData
    ? cachedPlayerData
    : fetchedPlayerData;

  const hasFetchError = shouldEnableJoinQuery && (!isSuccess || isError);

  const hasValidPlayerData = !hasFetchError && validatePlayerData(playerData);

  // if valid, cache it for next time...
  if (isMounted() && !hasValidCachedPlayerData && hasValidPlayerData) {
    setCachedPlayerData(playerData!);
  }

  return {
    playerData,
    isLoading,
    hasError: !hasValidPlayerData,
  };
};

const PlayerCredentialsProvider = ({
  playerName,
  gameID,
  matchID,
  GameClientComponent,
}: {
  playerName: string;
  gameID: string;
  matchID: string;
  GameClientComponent: GameClient;
}) => {
  const { playerData, isLoading, hasError } = useGetPlayerData({
    playerName,
    gameID,
    matchID,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return <div>Uh oh. Something went wrong.</div>;
  }
  // we know this is valid by now...
  const { playerID, playerCredentials } = playerData!;

  return (
    <GameClientComponent
      playerID={playerID}
      credentials={playerCredentials}
      matchID={matchID}
    />
  );
};

export const GamePage: FC<GamePageProps> = ({
  gameConfig,
  GameClientComponent,
}) => {
  const { matchID } = useParams<{ matchID: string }>();
  const [playerName] = useLocalStorage<string>('playerName', '');

  // incase something went wrong routing
  if (!isNonEmptyString(matchID)) {
    return (
      <Box>
        <p>Invalid matchID found.</p>;
      </Box>
    );
  }
  // incase player has not registered yet (playerName)
  if (!isNonEmptyString(playerName)) {
    return (
      <Box>
        <PlayerRegister gameTitle={gameConfig.title} />
      </Box>
    );
  }

  return (
    <Box>
      <PlayerCredentialsProvider
        gameID={gameConfig.id}
        playerName={playerName}
        matchID={matchID!} // we know matchID is nonempty
        GameClientComponent={GameClientComponent}
      />
    </Box>
  );
};
