import {
  IconShield,
  IconShieldHalfFilled,
  IconUpload,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Text,
} from '@mantine/core';
import { FC } from 'react';
import { LoveLetterPlayer } from '@games';
import { getCardImage } from 'utils/love-letter';

type LoveLetterPlayerCardProps = {
  player: LoveLetterPlayer;
  hasBorder: boolean;
};

export const LoveLetterPlayerCard: FC<LoveLetterPlayerCardProps> = ({
  player,
  hasBorder,
}) => {
  const { name, isActive, isProtected } = player;
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      mih={130}
      style={{ ...(hasBorder ? { border: '2px solid cyan' } : {}) }}
    >
      <Group justify="space-between">
        <Text
          size="xs"
          fw={900}
          variant="gradient"
          gradient={{ from: 'indigo', to: 'red', deg: 45 }}
        >
          {name}
        </Text>
        {isProtected && (
          <Badge size="xs" color="indigo">
            PROTECTED
          </Badge>
        )}
        <Badge size="xs" color={isActive ? 'teal' : 'red'}>
          {isActive ? 'Active' : 'Eliminated'}
        </Badge>
      </Group>

      <Divider my="xs" />

      <Text size="xs" color="yellow">
        Discard pile:
      </Text>
      <Group gap="xs">
        <Avatar.Group spacing="lg">
          {player.discard.map((card, idx) => (
            <Avatar
              key={idx}
              src={getCardImage(card.name)}
              radius="xl"
              size="lg"
            />
          ))}
        </Avatar.Group>
      </Group>
    </Card>
  );
};
