import {
  ActionIcon,
  CopyButton,
  Flex,
  TextInput,
  Tooltip,
  rem,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { FC } from 'react';

type CopyToClipboardInputProps = {
  value: string;
};

export const CopyToClipboardInput: FC<CopyToClipboardInputProps> = ({
  value,
}) => {
  // State

  // Effects

  return (
    <Flex align="flex-end" gap={8} w="100%">
      <TextInput
        flex={5}
        size="xs"
        value={value}
        variant="filled"
        color="indigo"
        readOnly
      />
      <CopyButton value={value} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? 'Copied!' : 'Copy'}
            withArrow
            position="right"
          >
            <ActionIcon
              color={copied ? 'teal' : 'gray'}
              variant="subtle"
              onClick={copy}
            >
              {copied ? (
                <IconCheck style={{ width: rem(16) }} />
              ) : (
                <IconCopy style={{ width: rem(16) }} />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Flex>
  );
};
