import { Card, Group, Button, Image, Text } from '@mantine/core';
import { FC } from 'react';
import classes from './application-card.module.css';

type ApplicationCardProps = {
  game: {
    title: string;
    description: string;
    path: string;
    thumbnail: string;
  };
};

export const ApplicationCard: FC<ApplicationCardProps> = ({ game }) => (
  <Card withBorder padding="lg" className={classes.card}>
    <Card.Section>
      <Image src={game.thumbnail} alt={game.title} height={150} />
    </Card.Section>
    <Group justify="space-between" mt="md">
      <Text fz="sm" fw={700} className={classes.title}>
        {game.title}
      </Text>
    </Group>
    <Text mt="sm" mb="md" c="dimmed" fz="xs" h={35} lineClamp={2}>
      {game.description}
    </Text>
    <Card.Section className={classes.footer}>
      <Button fullWidth>Play</Button>
    </Card.Section>
  </Card>
);
