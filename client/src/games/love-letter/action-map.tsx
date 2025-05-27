import { BaseCards, LoveLetterState, StageKey, StageMoves } from '@games';
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Ctx } from 'boardgame.io';
import { FC, ReactNode } from 'react';
import { FunHubBoardProps } from 'types';
import { getCardImage } from 'utils/love-letter';

export const ActionMap: Record<
  StageKey,
  FC<FunHubBoardProps<LoveLetterState>>
> = {
  BeginTurn: ({ G, ctx, moves }) => {
    const currentPlayer = ctx.currentPlayer;
    const clientPlayer = G.players[currentPlayer];

    const hasCountess = clientPlayer.hand.some(
      ({ name }) => name === 'Countess'
    );

    return (
      <Center style={{ gap: 8, flexDirection: 'column' }}>
        <Text size="sm" fw={700} c="yellow">
          Play a card:
        </Text>
        <Group>
          {clientPlayer.hand.map((card, idx) => {
            const disabled =
              (card.name === 'Prince' || card.name === 'King') && hasCountess;
            return (
              <Button
                key={idx}
                size="xs"
                variant="light"
                disabled={disabled}
                onClick={() => moves.stageCard(card.name)}
              >
                [{card.value}] {card.name}
              </Button>
            );
          })}
        </Group>
      </Center>
    );
  },
  Guard: ({ G, moves, playerID }) => {
    const players = Object.values(G.players).filter(
      ({ id, isActive, isProtected }) =>
        id !== playerID && isActive && !isProtected
    );

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Target player:
        </Text>
        <Box display="flex" style={{ justifyContent: 'center', gap: 8 }}>
          {players.map((player, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.targetPlayer(player.id)}
            >
              {player.name}
            </Button>
          ))}
        </Box>
      </Box>
    );
  },
  GuardTarget: ({ moves }) => {
    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Guess card:
        </Text>
        <SimpleGrid cols={3} spacing={4}>
          {BaseCards.filter(({ name }) => name !== 'Guard').map((card, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.guessCard(card.name)}
            >
              [{card.value}] {card.name}
            </Button>
          ))}
        </SimpleGrid>
      </Box>
    );
  },
  Priest: ({ G, moves, playerID }) => {
    const players = Object.values(G.players).filter(
      ({ id, isActive, isProtected }) =>
        id !== playerID && isActive && !isProtected
    );

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Target player:
        </Text>
        <Box display="flex" style={{ justifyContent: 'center', gap: 8 }}>
          {players.map((player, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.targetPlayer(player.id)}
            >
              {player.name}
            </Button>
          ))}
        </Box>
      </Box>
    );
  },
  PriestEffect: ({ G, moves, ctx }) => {
    const [opened, { open, close }] = useDisclosure(true);
    const currentPlayer = ctx.currentPlayer;
    const targetId = G.players[currentPlayer].target;
    const target = G.players[targetId as string];

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', justifyContent: 'center' }}
      >
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Text size="sm" fw={700} c="teal">
              {target.name}'s hand
            </Text>
          }
          centered
        >
          <Box display="flex" style={{ justifyContent: 'center' }}>
            {target.hand.map((card, idx) => (
              <Avatar
                key={idx}
                src={getCardImage(card.name)}
                radius="md"
                size="xl"
                style={{ height: '114px' }}
              />
            ))}
          </Box>
        </Modal>
        <Button size="xs" variant="light" onClick={open}>
          Peek {target.name}'s hand
        </Button>
        <Button size="xs" variant="light" onClick={() => moves.proceed()}>
          End turn
        </Button>
      </Box>
    );
  },
  Baron: ({ G, moves, playerID }) => {
    const players = Object.values(G.players).filter(
      ({ id, isActive, isProtected }) =>
        id !== playerID && isActive && !isProtected
    );

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Target player:
        </Text>
        <Box display="flex" style={{ justifyContent: 'center', gap: 8 }}>
          {players.map((player, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.targetPlayer(player.id)}
            >
              {player.name}
            </Button>
          ))}
        </Box>
      </Box>
    );
  },
  BaronEffect: ({ G, moves, ctx }) => {
    const [opened, { open, close }] = useDisclosure(true);
    const currentPlayer = ctx.currentPlayer;
    const targetId = G.players[currentPlayer].target;
    const player = G.players[currentPlayer];
    const target = G.players[targetId as string];
    const players = [player, target];

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', justifyContent: 'center' }}
      >
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Text size="sm" fw={700} c="teal">
              Comparing hands
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
          </SimpleGrid>
          <Box display="flex" style={{ justifyContent: 'center' }}></Box>
        </Modal>
        <Button size="xs" variant="light" onClick={open}>
          Show hands
        </Button>
        <Button size="xs" variant="light" onClick={() => moves.proceed()}>
          Done
        </Button>
      </Box>
    );
  },
  BaronEffectForTarget: ({ G, ctx }) => {
    const [opened, { open, close }] = useDisclosure(true);
    const currentPlayer = ctx.currentPlayer;
    const targetId = G.players[currentPlayer].target;
    const player = G.players[currentPlayer];
    const target = G.players[targetId as string];
    const players = [player, target];

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', justifyContent: 'center' }}
      >
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Text size="sm" fw={700} c="teal">
              Comparing hands:
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
          </SimpleGrid>
          <Box display="flex" style={{ justifyContent: 'center' }}></Box>
        </Modal>
        <Button size="xs" variant="light" onClick={open}>
          Show hands
        </Button>
      </Box>
    );
  },
  Prince: ({ G, moves }) => {
    const players = Object.values(G.players).filter(
      ({ isActive, isProtected }) => isActive && !isProtected
    );

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Target player:
        </Text>
        <Box display="flex" style={{ justifyContent: 'center', gap: 8 }}>
          {players.map((player, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.targetPlayer(player.id)}
            >
              {player.name}
            </Button>
          ))}
        </Box>
      </Box>
    );
  },
  King: ({ G, moves, playerID }) => {
    const players = Object.values(G.players).filter(
      ({ id, isActive, isProtected }) =>
        id !== playerID && isActive && !isProtected
    );

    return (
      <Box
        display="flex"
        style={{ gap: 8, alignItems: 'center', flexDirection: 'column' }}
      >
        <Text size="sm" fw={700} c="yellow">
          Target player:
        </Text>
        <Box display="flex" style={{ justifyContent: 'center', gap: 8 }}>
          {players.map((player, idx) => (
            <Button
              key={idx}
              size="xs"
              variant="light"
              onClick={() => moves.targetPlayer(player.id)}
            >
              {player.name}
            </Button>
          ))}
        </Box>
      </Box>
    );
  },
  EndTurn: ({ moves }) => {
    return (
      <Center>
        <Button size="xs" variant="light" onClick={() => moves.endTurn()}>
          End turn
        </Button>
      </Center>
    );
  },
};
