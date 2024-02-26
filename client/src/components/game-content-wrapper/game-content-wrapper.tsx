import { Box } from '@mantine/core';
import { PropsWithChildren } from 'react';
import styles from './game-content-wrapper.module.css';

export const GameContentWrapper = ({ children }: PropsWithChildren) => {
  return <Box className={styles.gameContentWrapper}>{children}</Box>;
};
