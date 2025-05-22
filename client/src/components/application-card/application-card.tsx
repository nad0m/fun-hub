import {
  Card,
  Group,
  Button,
  Image,
  Text,
  Modal,
  Box,
  TextInput,
  Stack,
  Divider,
  Flex,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { GameConfig } from 'types';
import { useLobbyService } from 'hooks';
import { triggerNotification } from 'utils/trigger-notification';
import { useNavigate } from 'react-router-dom';
import classes from './application-card.module.css';

type ApplicationCardProps = {
  game: GameConfig;
};

export const ApplicationCard: FC<ApplicationCardProps> = ({ game }) => {
  const {
    createRoomMutation: { mutate: createMatch, isPending },
  } = useLobbyService();
  const navigate = useNavigate();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const selectData: string[] = [];
  let count = game.minPlayers;
  while (count <= game.maxPlayers) {
    selectData.push(`${count} players`);
    count += 1;
  }
  const form = useForm({
    initialValues: {
      roomCode: '',
      numPlayersText: selectData?.[0] || '',
    },
  });
  const numPlayers = parseInt(form.values.numPlayersText.split(' ')[0], 10);

  return (
    <>
      <Modal
        opened={modalOpened || isPending}
        onClose={close}
        title={
          <Text component="span" style={{ fontSize: 24, fontWeight: 900 }}>
            {game.title}
          </Text>
        }
        size="md"
        pos="relative"
      >
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {/* ...other content */}
        <Stack gap={24}>
          <Box m={0} w="100%">
            <Image src={game.thumbnail} alt={game.title} w="100%" h={120} />
          </Box>
          <Flex align="flex-end" gap={12}>
            <Select
              flex={4}
              label="Number of players"
              allowDeselect={false}
              data={selectData}
              {...form.getInputProps('numPlayersText')}
            />
            <Button
              flex={1}
              variant="light"
              onClick={() =>
                createMatch(
                  { gameId: game.id, numPlayers },
                  {
                    onSuccess: (roomID) => {
                      triggerNotification(
                        'Success',
                        `Game successfully created. Game code: ${roomID}`
                      );
                      navigate(`${game.path}/${roomID}`);
                    },
                    onError: () => {
                      triggerNotification('Error', 'Error creating game room.');
                    },
                  }
                )
              }
            >
              Create
            </Button>
          </Flex>
        </Stack>
        <Divider
          my={24}
          label={
            <Text c="gray" style={{ fontWeight: 900 }}>
              OR
            </Text>
          }
          labelPosition="center"
        />
        <Flex align="flex-end" gap={12}>
          <TextInput
            label="Join with room code"
            placeholder="Paste room code or link here"
            flex={4}
            {...form.getInputProps('roomCode')}
          />
          <Button
            flex={1}
            variant="light"
            disabled={form.values.roomCode.length === 0}
          >
            Join
          </Button>
        </Flex>
      </Modal>
      <Card withBorder padding="lg" className={classes.card}>
        <Card.Section>
          <Image src={game.thumbnail} alt={game.title} height={150} />
        </Card.Section>
        <Group justify="space-between" mt="md">
          <Text fz="sm" fw={700} className={classes.title}>
            {game.title}
          </Text>
        </Group>
        <Text mt="sm" mb="md" c="dimmed" fz="xs" h={35} lineClamp={2}>
          {game.description}
        </Text>
        <Card.Section className={classes.footer}>
          <Button fullWidth variant="light" onClick={open}>
            Play
          </Button>
        </Card.Section>
      </Card>
    </>
  );
};
