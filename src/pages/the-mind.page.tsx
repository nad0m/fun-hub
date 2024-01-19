import { TheMindClient } from 'games';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { joinMatch } from 'services/lobby-service';
import { Box, Button, Loader, Modal, Text, TextInput } from '@mantine/core';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { LobbyAPI } from 'boardgame.io';
import { Game } from 'types';
import { useForm } from '@mantine/form';
import { IconSend2 } from '@tabler/icons-react';

type TheMindPageProps = {
  game: Game;
};
export const TheMindPage: FC<TheMindPageProps> = ({ game }) => {
  const matchID = useParams<{ roomID: string }>().roomID as string;
  const playerData = useReadLocalStorage(matchID) as LobbyAPI.JoinedMatch;
  const [playerName, setPlayerName] = useLocalStorage<string>('playerName', '');
  const form = useForm({
    initialValues: {
      playerName: '',
    },
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['joinMatch', { matchID, playerData }],
    queryFn: async () => joinMatch({ gameName: 'TheMind', matchID, playerName }),
    enabled: !playerData && !!playerName,
  });

  console.log(!playerData && !!playerName);

  const playerID = data?.playerID || playerData?.playerID;
  const playerCredentials = data?.playerCredentials || playerData?.playerCredentials;

  if (isLoading) {
    return <Loader />;
  }

  if (isSuccess) {
    localStorage.setItem(matchID, JSON.stringify(data));
  }

  console.log({ playerName });

  return (
    <Box>
      <Modal
        opened={!playerName}
        withCloseButton={false}
        onClose={() => null}
        title={
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: 'cyan', to: 'yellow' }}
            style={{ fontSize: 24, fontWeight: 900 }}
          >
            {game.title}
          </Text>
        }
        size="md"
        pos="relative"
      >
        <form
          style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}
          onSubmit={form.onSubmit((values) => setPlayerName(values.playerName))}
        >
          <TextInput
            flex={5}
            label="Name"
            placeholder="Enter your name"
            required
            maxLength={16}
            autoFocus
            {...form.getInputProps('playerName')}
          />
          <Button flex={1} type="submit" variant="outline" rightSection={<IconSend2 size={16} />}>
            Enter
          </Button>
        </form>
      </Modal>

      {!!playerName && (
        <TheMindClient playerID={playerID} credentials={playerCredentials} matchID={matchID} />
      )}
    </Box>
  );
};
