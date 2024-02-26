import { Card, Center, Flex, Stack, Text, Title } from '@mantine/core';
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
}) => (
  <>
    <Center>
      <Title style={{ fontSize: 32 }}>{gameMetadata.title}</Title>
    </Center>
    <Center>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        style={{ width: 'fit-content' }}
        withBorder
      >
        <Stack align="center">
          <Text variant="h3" style={{ fontSize: 24 }}>
            Invite Players
          </Text>
          <Text>Send a link to your friends to invite them to your game.</Text>
          <Flex maw={420} w="100%">
            <CopyToClipboardInput value={copyPasteUrl} />
          </Flex>
          <Text>Game will start once all players are ready!</Text>
          {children}
        </Stack>
      </Card>
    </Center>
  </>
);
