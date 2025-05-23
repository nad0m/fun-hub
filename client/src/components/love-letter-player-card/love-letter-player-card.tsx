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
  Paper,
  Text,
} from '@mantine/core';
import { FC } from 'react';
import { LoveLetterPlayer } from '@games';
import { getCardImage } from 'utils/love-letter';

type LoveLetterPlayerCardProps = {
  player: LoveLetterPlayer;
  hasBorder: boolean;
  isClientPlayer?: boolean;
};

export const LoveLetterPlayerCard: FC<LoveLetterPlayerCardProps> = ({
  player,
  hasBorder,
  isClientPlayer,
}) => {
  const { name, isActive, isProtected } = player;
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      mih={130}
      style={{ ...(hasBorder ? { border: '2px solid #38d9a9' } : {}) }}
    >
      <Group>
        <Text
          size="xs"
          fw={900}
          variant="gradient"
          gradient={{ from: 'indigo', to: 'red', deg: 45 }}
        >
          {name}
          {isClientPlayer && ' (You)'}
        </Text>
        <Badge size="xs" color={isActive ? 'teal' : 'red'}>
          {isActive ? 'Active' : 'Eliminated'}
        </Badge>
        {isProtected && (
          <Badge size="xs" color="indigo">
            PROTECTED
          </Badge>
        )}
      </Group>

      <Divider my="xs" />

      <Text size="xs" color="yellow">
        Discarded:
      </Text>
      <Paper p="sm" display="flex" mih={80}>
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
      </Paper>
      {isClientPlayer && (
        <>
          <Divider my="xs" />
          <Text size="xs" color="green">
            Your hand:
          </Text>
          <Paper
            p="sm"
            display="flex"
            mih={138}
            style={{ justifyContent: 'center' }}
          >
            <Group gap="xs">
              <Avatar.Group spacing={0}>
                {player.hand.map((card, idx) => (
                  <Avatar
                    key={idx}
                    src={getCardImage(card.name)}
                    radius="md"
                    size="xl"
                    style={{ height: '114px' }}
                  />
                ))}
              </Avatar.Group>
            </Group>
          </Paper>
        </>
      )}
    </Card>
  );
};
