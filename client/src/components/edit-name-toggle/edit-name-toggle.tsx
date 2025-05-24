import { ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';
import { PlayerRegister } from 'components/player-register';
import { BASE_ROUTE } from 'config/constants';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';

export const EditNameToggle: FC = () => {
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);

  console.log({ pathname });

  if (pathname !== BASE_ROUTE) {
    return;
  }

  return (
    <>
      <Tooltip label={`Change name`}>
        <ActionIcon
          onClick={open}
          variant="default"
          size="lg"
          aria-label="Change name"
          style={{ borderRadius: 8 }}
        >
          <IconPencil />
        </ActionIcon>
      </Tooltip>
      <PlayerRegister gameTitle="Change name" opened={opened} close={close} />
    </>
  );
};
