import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  MantineColorScheme,
  Tooltip,
} from '@mantine/core';
import { IconSun, IconMoon, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './theme-toggle.module.css';

const colorSchemeToggleMap: MantineColorScheme[] = ['dark', 'light', 'auto'];

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const [colorIdx, setColorIdx] = useState(colorSchemeToggleMap.indexOf(computedColorScheme));
  const nextColor = colorSchemeToggleMap[(colorIdx + 1) % 3];

  return (
    <Tooltip label={`Toggle ${nextColor} mode`}>
      <ActionIcon
        onClick={() => {
          setColorIdx((colorIdx + 1) % 3);
          setColorScheme(nextColor);
        }}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
        style={{ borderRadius: 8 }}
      >
        {nextColor === 'light' && <IconSun className={cx(classes.icon)} stroke={1.5} />}
        {nextColor === 'dark' && <IconMoon className={cx(classes.icon)} stroke={1.5} />}
        {nextColor === 'auto' && (
          <IconAdjustmentsHorizontal className={cx(classes.icon)} stroke={1.5} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
