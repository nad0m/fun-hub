import '@mantine/core/styles.css';
import { AppShell, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { ThemeToggle } from 'components/theme-toggle';
import { Router } from './router';
import { theme } from './theme';
import { AppTitle } from './components';
import '@mantine/notifications/styles.css';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </MantineProvider>
  );
}
