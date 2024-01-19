import { Text } from '@mantine/core';
import { FC } from 'react';
import { useInterval } from 'usehooks-ts';

type CountDownProps = {
  moves: Record<string, (...args: any[]) => void>;
  time: number;
  isCurrentPlayer: boolean;
};

export const CountDown: FC<CountDownProps> = ({ moves, time, isCurrentPlayer }) => {
  useInterval(() => {
    if (isCurrentPlayer) {
      moves.countDownToTransition();
    }
  }, 1000);

  return <Text>Starting game in {time}...</Text>;
};
