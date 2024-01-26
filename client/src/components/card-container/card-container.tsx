import { FC } from 'react';
import { Box, Card, Image, Text, Badge, Button, Group, SimpleGrid } from '@mantine/core';
import classes from './card-container.module.css';

type CardContainerProps = {};

export const CardContainer: FC<CardContainerProps> = () => (
  // State

  // Effects

  <SimpleGrid className={classes['card-container']} cols={7}>
    {new Array(10).fill(null).map((_, i) => (
      <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    ))}
  </SimpleGrid>
);
