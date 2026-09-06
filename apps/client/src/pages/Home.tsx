import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconBookmark, IconUsers } from '@tabler/icons-react';
import { useRandomListStore } from '../store/randomListStore';
import { queryKeys } from '../api/queryKeys';
import classes from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetRandomList = useRandomListStore((state) => state.reset);

  function handleFetch() {
    resetRandomList();
    queryClient.invalidateQueries({ queryKey: queryKeys.randomUsers });
    navigate('/random');
  }

  function handleHistory() {
    navigate('/saved');
  }

  return (
    <Container size="sm" py={80}>
      <Stack align="center" gap={4} mb="xl">
        <Title order={1} ta="center">
          People Directory
        </Title>
        <Text c="dimmed" ta="center">
          Discover random profiles and keep the people you want to remember.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Card withBorder radius="lg" p="xl" className={classes.card} onClick={handleFetch}>
          <Stack gap="sm">
            <ThemeIcon variant="light" size={48} radius="xl">
              <IconUsers size={24} />
            </ThemeIcon>
            <Title order={3}>Random People</Title>
            <Text c="dimmed" size="sm">
              Fetch 10 random profiles and explore their details.
            </Text>
            <Button
              variant="light"
              mt="sm"
              onClick={(event) => {
                event.stopPropagation();
                handleFetch();
              }}
            >
              Fetch
            </Button>
          </Stack>
        </Card>

        <Card withBorder radius="lg" p="xl" className={classes.card} onClick={handleHistory}>
          <Stack gap="sm">
            <ThemeIcon variant="light" size={48} radius="xl">
              <IconBookmark size={24} />
            </ThemeIcon>
            <Title order={3}>Saved Profiles</Title>
            <Text c="dimmed" size="sm">
              View and manage the profiles you've saved.
            </Text>
            <Button
              variant="light"
              mt="sm"
              onClick={(event) => {
                event.stopPropagation();
                handleHistory();
              }}
            >
              History
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
