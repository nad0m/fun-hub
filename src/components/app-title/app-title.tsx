import { Title, Text, Image } from '@mantine/core';
import classes from './app-title.module.css';

export function AppTitle() {
  return (
    <Title className={classes.title}>
      <Image
        src="https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/logo.jpeg"
        style={{ borderRadius: '50%' }}
        alt="Fun hub logo"
        w={30}
        h={30}
      />
      <Text
        inherit
        variant="gradient"
        component="span"
        gradient={{ from: 'pink', to: 'yellow' }}
        style={{ fontSize: 32, fontWeight: 900 }}
      >
        Fun Hub
      </Text>
    </Title>
  );
}
