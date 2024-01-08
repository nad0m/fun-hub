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
} from '@mantine/core';
import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import classes from './application-card.module.css';

type ApplicationCardProps = {
  game: {
    title: string;
    description: string;
    path: string;
    thumbnail: string;
  };
};

export const ApplicationCard: FC<ApplicationCardProps> = ({ game }) => {
  const [modalOpened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      roomCode: '',
    },
  });
  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
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
      >
        <Stack gap={24}>
          <Box m={0} w="100%">
            <Image src={game.thumbnail} alt={game.title} w="100%" h={120} />
          </Box>
          <Button>Create Room for {game.title}</Button>
        </Stack>

        <Divider my={24} label="OR" labelPosition="center" />
        <Flex align="flex-end" gap={12}>
          <TextInput
            label="Join with room code"
            placeholder="Paste room code or link here"
            flex={6}
            {...form.getInputProps('roomCode')}
          />
          <Button flex={1} color="indigo" disabled={form.values.roomCode.length === 0}>
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
          <Button fullWidth onClick={open}>
            Play
          </Button>
        </Card.Section>
      </Card>
    </>
  );
};
