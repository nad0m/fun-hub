import { useMutation } from '@tanstack/react-query';
import { createMatch, forcePlayMatch, joinMatch, leaveMatch } from 'services/lobby-service';

export const useLobbyService = () => {
  const createRoomMutation = useMutation({
    mutationFn: createMatch,
  });

  const joinMatchMutation = useMutation({
    mutationFn: joinMatch,
  });

  const leaveMatchMutation = useMutation({
    mutationFn: leaveMatch,
  });

  const forcePlayMatchMutation = useMutation({
    mutationFn: forcePlayMatch,
  });

  return {
    createRoomMutation,
    joinMatchMutation,
    leaveMatchMutation,
    forcePlayMatchMutation,
  };
};
