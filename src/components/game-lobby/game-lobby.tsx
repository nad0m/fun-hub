import { Flex, Stack, Text, Title } from '@mantine/core';
import { CopyToClipboardInput } from 'components/copy-to-clipboard-input';
import { FC, ReactNode } from 'react';
import { Game } from 'types';

type GameLobbyProps = {
  gameMetadata: Game;
  copyPasteUrl: string;
  children: ReactNode;
};

export const GameLobby: FC<GameLobbyProps> = ({ gameMetadata, copyPasteUrl, children }) => (
  <Stack align="center">
    <Title style={{ fontSize: 32 }}>{gameMetadata.title}</Title>
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
);
