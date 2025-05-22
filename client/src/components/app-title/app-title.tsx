import { Title, Text, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './app-title.module.css';
import logo from '../../assets/app/logo-v2.png';

export function AppTitle() {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Title className={classes.title}>
        <Image
          src={logo}
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
    </Link>
  );
}
