import { LoveLetterPlayer, Card as CardType } from '@games';
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Center,
  Flex,
  Image,
  MantineSize,
  Modal,
  Paper,
  Rating,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCards, IconInfoCircle, IconUsers } from '@tabler/icons-react';
import { FC, ReactNode } from 'react';
import { getCardImage } from 'utils/love-letter';
import ruleCard from '../../assets/love-letter/rule-card.png';

type LoveLetterPlayerHandProps = {
  player: LoveLetterPlayer;
  playerRatio?: string;
  deck: CardType[];
  deckSize: number;
  children?: ReactNode;
};
export const LoveLetterPlayerHand: FC<LoveLetterPlayerHandProps> = ({
  player,
  deck,
  deckSize,
  playerRatio,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Paper
        pos="relative"
        display="flex"
        p="xs"
        mih={138}
        style={{ justifyContent: 'space-between' }}
      >
        <ActionIcon
          pos="absolute"
          variant="light"
          color="gray"
          size="sm"
          onClick={open}
        >
          <IconInfoCircle
            style={{ width: '70%', height: '70%' }}
            stroke={1.5}
          />
        </ActionIcon>
        <Center style={{ gap: 8, flexDirection: 'column' }} flex={5}>
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
        <Card
          pos="absolute"
          right={8}
          p="xs"
          flex={1}
          w={75}
          style={{ gap: 8 }}
          h="fit-content"
          withBorder
        >
          <Flex align="center" justify="space-between">
            <IconUsers size={14} />
            <Text size="xs" fw={600} c="indigo">
              {playerRatio}
            </Text>
          </Flex>
          <Flex align="center" justify="space-between">
            <IconCards size={14} />
            <Text size="xs" fw={600} c="indigo">
              {deck.length}/{deckSize}
            </Text>
          </Flex>
        </Card>
      </Paper>

      <Modal opened={opened} onClose={close}>
        <Image src={ruleCard} alt="Rules" />
      </Modal>
    </>
  );
};
