import '@mantine/core/styles.css';
import { AppShell, MantineProvider } from '@mantine/core';
import { ThemeToggle } from '@components/theme-toggle';
import { Router } from './router';
import { theme } from './theme';
import { AppTitle } from './components';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell header={{ height: 60 }} padding={48}>
        <AppShell.Header
          display="flex"
          style={{ justifyContent: 'space-between', alignItems: 'center', padding: '0 48px' }}
        >
          <AppTitle />
          <ThemeToggle />
        </AppShell.Header>
        <AppShell.Main>
          <Router />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
