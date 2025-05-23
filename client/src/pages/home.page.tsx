import { ApplicationCard } from 'components/application-card';
import { SimpleGrid } from '@mantine/core';
import { FC } from 'react';
import { GAMES_GLOSSARY } from 'config/games';
import { useMediaQuery } from '@mantine/hooks';

export const HomePage: FC = () => {
  const tablet = useMediaQuery('(min-width: 600px)');
  const desktop = useMediaQuery('(min-width: 1000px)');

  let cols = 1;

  if (tablet) {
    cols = 2;
  }

  if (desktop) {
    cols = 4;
  }

  return (
    <SimpleGrid cols={cols}>
      {Object.values(GAMES_GLOSSARY).map((game) => (
        <ApplicationCard key={game.title} game={game} />
      ))}
    </SimpleGrid>
  );
};
