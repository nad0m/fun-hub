import { IconCards, IconInfoCircle } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  MantineSize,
  Modal,
  Paper,
  Rating,
  Text,
} from '@mantine/core';
import { FC } from 'react';
import { Card as CardType, LoveLetterPlayer } from '@games';
import { getCardImage } from 'utils/love-letter';
import { useDisclosure } from '@mantine/hooks';
import ruleCard from '../../assets/love-letter/rule-card.png';

type LoveLetterPlayerCardProps = {
  player: LoveLetterPlayer;
  hasBorder: boolean;
  isClientPlayer?: boolean;
  handOnly?: boolean;
  deck: CardType[];
};

export const LoveLetterPlayerCard: FC<LoveLetterPlayerCardProps> = ({
  player,
  hasBorder,
  isClientPlayer,
  handOnly,
  deck,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { name, isActive, isProtected } = player;
  return (
    <Card
      padding="xs"
      radius="md"
      mih={130}
      style={{ ...(hasBorder ? { border: '2px solid #38d9a9' } : {}) }}
      withBorder
    >
      {!handOnly && (
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

          <Divider my="xs" />

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
      )}
      {handOnly && (
        <>
          <Text size="xs" fw={500} c="green">
            Your hand:
          </Text>
          <Paper display="flex" p="xs" mih={138}>
            <Flex direction="column" align="flex-start" gap="sm">
              <ActionIcon variant="light" color="gray" size="sm" onClick={open}>
                <IconInfoCircle
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              </ActionIcon>
              <Flex align="center" style={{ gap: 4 }}>
                <IconCards size={18} />
                <Text size="sm">{deck.length}</Text>
              </Flex>
            </Flex>
            <Center style={{ gap: 8 }} w="100%">
              <Avatar.Group spacing={0}>
                {player.hand.map((card, idx) => (
                  <Box key={idx} pos="relative">
                    <Avatar
                      src={getCardImage(card.name)}
                      radius="md"
                      size="xl"
                      style={{ height: '114px' }}
                    />
                    <Rating
                      pos="absolute"
                      bottom="50%"
                      left="85%"
                      value={card.count}
                      count={card.count}
                      size={8 as unknown as MantineSize}
                      style={{
                        transform: 'translate(-50%, -50%) rotate(-90deg)',
                        '--rating-color': 'lime',
                      }}
                      readOnly
                    />
                  </Box>
                ))}
              </Avatar.Group>
            </Center>
          </Paper>
        </>
      )}
      <Modal opened={opened} onClose={close}>
        <Image src={ruleCard} alt="Rules" />
      </Modal>
    </Card>
  );
};
