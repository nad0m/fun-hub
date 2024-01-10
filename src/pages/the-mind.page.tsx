import { Client, Lobby } from 'boardgame.io/react';
import { TheMind, TicTacToe } from 'atom-games';
import { TheMindBoard, TheMindClient, TicTacToeBoard } from 'games';
import { FC, useCallback, useEffect, useState } from 'react';
import { useBeforeUnload, useParams } from 'react-router-dom';
import { LobbyPlayerList } from 'components';
import { useQuery } from '@tanstack/react-query';
import { getMatch, joinMatch } from 'services/lobby-service';
import { SocketIO } from 'boardgame.io/multiplayer';
import { useLobbyService } from 'hooks';
import { Button, Loader } from '@mantine/core';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { FilteredMetadata, LobbyAPI } from 'boardgame.io';
import { POLLING_INTERVAL, SERVER_URL } from '../constants';

export const TheMindPage: FC = () => {
  const matchID = useParams<{ roomID: string }>().roomID as string;
  const playerData = useReadLocalStorage(matchID) as LobbyAPI.JoinedMatch;
  const [isGameReady, setIsGameReady] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<LobbyAPI.Match | undefined>(undefined);
  const {
    forcePlayMatchMutation: { mutate: forcePlay, isPending: forcePlayPending },
    leaveMatchMutation: { mutate: leaveMatch },
  } = useLobbyService();
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['joinMatch'],
    queryFn: async () => joinMatch({ gameName: 'themind', matchID, playerName: 'dev' }),
    enabled: !playerData,
    staleTime: Infinity,
  });

  const playerID = data?.playerID || playerData?.playerID;
  const playerCredentials = data?.playerCredentials || playerData?.playerCredentials;

  // useQuery({
  //   queryKey: ['getMatch'],
  //   queryFn: async () => getMatch('themind', matchID),
  //   refetchInterval: (refetchedData) => {
  //     setMatchData(refetchedData.state.data);
  //     return isGameReady ? false : POLLING_INTERVAL;
  //   },
  // });

  // useBeforeUnload(
  //   useCallback(() => {
  //     leaveMatch({ gameName: 'TheMind', matchID, playerID, credentials: playerCredentials });
  //     localStorage.removeItem(matchID);
  //   }, [matchID, playerID, playerID, playerCredentials])
  // );

  // useEffect(
  //   () => () =>
  //     leaveMatch({ gameName: 'TheMind', matchID, playerID, credentials: playerCredentials }),
  //   []
  // );

  if (isLoading || forcePlayPending) {
    return <Loader />;
  }

  if (isSuccess) {
    localStorage.setItem(matchID, JSON.stringify(data));
  }

  const onForcePlaySuccess = () => {
    setIsGameReady(true);
  };

  return (
    <>
      {/* <LobbyPlayerList matchData={matchData?.players} /> */}

      <TheMindClient playerID={playerID} credentials={playerCredentials} matchID={matchID} />
    </>
  );
};
