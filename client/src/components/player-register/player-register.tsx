import type { FC } from 'react';
import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend2 } from '@tabler/icons-react';
import { useLocalStorage } from 'usehooks-ts';

type PlayerRegisterProps = {
  gameTitle: string;
};

export const PlayerRegister: FC<PlayerRegisterProps> = ({ gameTitle }) => {
  const [, setPlayerName] = useLocalStorage<string>('playerName', '');

  const form = useForm({ initialValues: { playerName: '' } });
  const handleSubmit = form.onSubmit((values) =>
    setPlayerName(values.playerName)
  );

  return (
    <Modal
      opened
      withCloseButton={false}
      onClose={() => null}
      title={
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'cyan', to: 'yellow' }}
          style={{ fontSize: 24, fontWeight: 900 }}
        >
          {gameTitle}
        </Text>
      }
      size="md"
      pos="relative"
    >
      <form
        style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}
        onSubmit={handleSubmit}
      >
        <TextInput
          flex={5}
          label="Name"
          placeholder="Enter your name"
          required
          maxLength={16}
          autoFocus
          {...form.getInputProps('playerName')}
        />
        <Button
          flex={1}
          type="submit"
          variant="outline"
          rightSection={<IconSend2 size={16} />}
        >
          Enter
        </Button>
      </form>
    </Modal>
  );
};
