import { Card as CardType, LoveLetterPlayer } from '@games';
import {
  Avatar,
  Button,
  Card,
  Center,
  Modal,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC } from 'react';
import { getCardImage } from 'utils/love-letter';

type LoveLetterShowHandsProps = {
  players: LoveLetterPlayer[];
  subtitle?: string;
  defaultOpened?: boolean;
  discard?: CardType;
};

export const LoveLetterShowHands: FC<LoveLetterShowHandsProps> = ({
  players,
  subtitle = 'Showing hands',
  defaultOpened = false,
  discard,
}) => {
  const [opened, { open, close }] = useDisclosure(defaultOpened);

  return (
    <>
      <Button size="xs" variant="outline" onClick={open}>
        Reveal hand(s)
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text size="sm" fw={700} c="teal">
            {subtitle}
          </Text>
        }
        centered
      >
        <SimpleGrid cols={2}>
          {players.map(({ name, hand }, idx) => {
            return (
              <Center key={idx} style={{ flexDirection: 'column' }}>
                <Text size="sm" fw={700} c="yellow">
                  {name}'s hand:
                </Text>
                <Card key={idx} p="xs">
                  {hand.map((card, idx) => (
                    <Avatar
                      key={idx}
                      src={getCardImage(card.name)}
                      radius="md"
                      size="xl"
                      style={{ height: '114px' }}
                    />
                  ))}
                </Card>
              </Center>
            );
          })}
          {discard && (
            <Center style={{ flexDirection: 'column' }}>
              <Text size="sm" fw={700} c="indigo">
                Hidden card:
              </Text>
              <Card p="xs">
                <Avatar
                  src={getCardImage(discard.name)}
                  radius="md"
                  size="xl"
                  style={{ height: '114px' }}
                />
              </Card>
            </Center>
          )}
        </SimpleGrid>
      </Modal>
    </>
  );
};
