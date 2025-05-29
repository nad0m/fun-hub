import { Avatar, Badge, Card, Flex, Group, Paper, Text } from '@mantine/core';
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
      padding="xs"
      radius="md"
      mih={130}
      style={{ ...(hasBorder ? { border: '2px solid #38d9a9' } : {}) }}
      withBorder
    >
      <>
        <Flex justify="space-between">
          <Group>
            <Text size="xs" fw={900} c={isClientPlayer ? 'indigo' : 'red'}>
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
          <Text size="xs" fw={700}>
            Wins: {player.wins}
          </Text>
        </Flex>

        <Text size="xs" fw={500} c="orange">
          Discarded:
        </Text>
        <Paper p="sm" display="flex" mih={80}>
          <Group gap="xs">
            <Avatar.Group spacing="xl">
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
      </>
    </Card>
  );
};
