import { AppShell, Button, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { Link, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { RandomList } from '../pages/RandomList';
import { SavedProfiles } from '../pages/SavedProfiles';
import { ProfileDetail } from '../pages/ProfileDetail';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';

export function App() {
  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <UnstyledButton component={Link} to="/">
            <Group gap="xs">
              <ThemeIcon variant="light" radius="xl" size={32}>
                <IconUsers size={18} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                People Directory
              </Text>
            </Group>
          </UnstyledButton>
          <Group gap="sm">
            <Button variant="subtle" component={Link} to="/random">
              Random People
            </Button>
            <Button variant="subtle" component={Link} to="/saved">
              History
            </Button>
            <ColorSchemeToggle />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/random" element={<RandomList />} />
          <Route path="/saved" element={<SavedProfiles />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
