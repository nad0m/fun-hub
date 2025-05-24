import { Card, Center, Flex, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CopyToClipboardInput } from 'components/copy-to-clipboard-input';
import { FC, ReactNode } from 'react';
import { GameConfig } from 'types';

type GameLobbyProps = {
  gameMetadata: GameConfig;
  copyPasteUrl: string;
  children: ReactNode;
};

export const GameLobby: FC<GameLobbyProps> = ({
  gameMetadata,
  copyPasteUrl,
  children,
}) => {
  const tablet = useMediaQuery('(min-width: 500px)');

  return (
    <>
      <Center>
        <Title style={{ fontSize: 32 }}>{gameMetadata.title}</Title>
      </Center>
      <Center>
        <Card
          mt="md"
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ width: 'fit-content' }}
          withBorder
        >
          <Stack align="center">
            <Text variant="h3" style={{ fontSize: tablet ? 24 : 20 }}>
              Invite Players
            </Text>
            <Text size={tablet ? 'md' : 'sm'}>
              Send a link to your friends to invite them to your game.
            </Text>
            <Flex maw={420} w="100%">
              <CopyToClipboardInput value={copyPasteUrl} />
            </Flex>
            <Text size={tablet ? 'md' : 'sm'}>
              Game will start once all players are ready!
            </Text>
            {children}
          </Stack>
        </Card>
      </Center>
    </>
  );
};
