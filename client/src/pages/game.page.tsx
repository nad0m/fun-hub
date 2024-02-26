import { type FC } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from 'usehooks-ts';
import { LobbyAPI } from 'boardgame.io';
import { PlayerRegister } from 'components/player-register';
import { joinMatch } from 'services/lobby-service';
import { isNonEmptyString, validatePlayerData } from 'utils/validators';
import { ClientComponent, GameConfig, GamePageProps } from 'types';
import { useIsMountedEffect } from 'hooks';
import { GameContentWrapper } from 'components/game-content-wrapper';

const useGetMatchPlayerData = ({
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
  const isMounted = useIsMountedEffect();

  const [cachedPlayerData, setCachedPlayerData] =
    useLocalStorage<LobbyAPI.JoinedMatch | null>(matchID, null);

  const hasValidCachedPlayerData = validatePlayerData(cachedPlayerData);

  const shouldEnableJoinQuery =
    isMounted && isNonEmptyString(playerName) && !hasValidCachedPlayerData;

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
  if (isMounted && !hasValidCachedPlayerData && hasValidPlayerData) {
    setCachedPlayerData(playerData!);
  }

  return {
    playerData,
    isLoading: !isMounted || isLoading,
    hasError: isMounted && !isLoading && !hasValidPlayerData,
  };
};

const GameWithMatchDataWrapper = ({
  gameConfig,
  playerName,
  matchID,
  GameClientComponent,
}: {
  gameConfig: GameConfig;
  playerName: string;
  matchID: string;
  GameClientComponent: ClientComponent;
}) => {
  const { playerData, isLoading, hasError } = useGetMatchPlayerData({
    gameID: gameConfig.id,
    playerName,
    matchID,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return <div>Uh oh. Something went wrong joining match.</div>;
  }
  // we know this is valid by now...
  const { playerID, playerCredentials } = playerData!;

  return (
    <GameClientComponent
      // TODO: extend GameClient type props
      // @ts-ignore - it was impossible to add this to the props type...
      // It sucks that we cant enforce this, but theres no realistic way to overwrite the type
      gameConfig={gameConfig}
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
      <GameContentWrapper>
        <p>Invalid matchID found.</p>;
      </GameContentWrapper>
    );
  }
  // incase player has not registered yet (playerName)
  if (!isNonEmptyString(playerName)) {
    return (
      <GameContentWrapper>
        <PlayerRegister gameTitle={gameConfig.title} />
      </GameContentWrapper>
    );
  }
  // game with match data wrapper
  return (
    <GameContentWrapper>
      <GameWithMatchDataWrapper
        gameConfig={gameConfig}
        playerName={playerName}
        matchID={matchID!} // we know matchID is nonempty
        GameClientComponent={GameClientComponent}
      />
    </GameContentWrapper>
  );
};
