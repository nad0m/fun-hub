import { ApplicationCard } from 'components/application-card';
import { SimpleGrid } from '@mantine/core';
import { FC } from 'react';
import { GAMES_GLOSSARY } from 'config/games';

export const HomePage: FC = () => (
  <SimpleGrid cols={4}>
    {Object.values(GAMES_GLOSSARY).map((game) => (
      <ApplicationCard key={game.title} game={game} />
    ))}
  </SimpleGrid>
);
