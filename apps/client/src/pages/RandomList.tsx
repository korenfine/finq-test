import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconUsers } from '@tabler/icons-react';
import { fetchRandomUsers } from '../api/randomUserApi';
import { queryKeys } from '../api/queryKeys';
import { useRandomListStore } from '../store/randomListStore';
import { EmptyState } from '../components/EmptyState';
import { PersonList } from '../components/PersonList';
import { PersonListSkeleton } from '../components/PersonListSkeleton';
import type { PersonListItem } from '../components/PersonRow';

export function RandomList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const people = useRandomListStore((state) => state.people);
  const setPeople = useRandomListStore((state) => state.setPeople);
  const resetRandomList = useRandomListStore((state) => state.reset);

  const query = useQuery({
    queryKey: queryKeys.randomUsers,
    queryFn: () => fetchRandomUsers(10),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data && people.length === 0) {
      setPeople(query.data);
    }
  }, [query.data, people.length, setPeople]);

  function handleRefresh() {
    resetRandomList();
    queryClient.invalidateQueries({ queryKey: queryKeys.randomUsers });
  }

  const items: PersonListItem[] = people.map((person) => ({
    key: person.uuid,
    title: person.title,
    firstName: person.firstName,
    lastName: person.lastName,
    gender: person.gender,
    country: person.country,
    phone: person.phone,
    email: person.email,
    thumbnailUrl: person.thumbnailUrl,
  }));

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={0}>
            <Title order={2}>Random People</Title>
            <Text c="dimmed">Discover 10 randomly generated profiles.</Text>
          </Stack>
          <Button leftSection={<IconRefresh size={16} />} onClick={handleRefresh} loading={query.isFetching}>
            Refresh
          </Button>
        </Group>

        {query.isLoading && <PersonListSkeleton />}

        {query.isError && (
          <Alert color="red" icon={<IconAlertCircle size={18} />} title="Unable to load people">
            Something went wrong while loading random profiles.
            <Group mt="sm">
              <Button size="xs" variant="light" color="red" onClick={() => query.refetch()}>
                Try again
              </Button>
            </Group>
          </Alert>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <EmptyState
            icon={IconUsers}
            title="No people to show"
            description="Try refreshing to fetch a new batch."
            actionLabel="Refresh"
            onAction={handleRefresh}
          />
        )}

        {!query.isLoading && !query.isError && items.length > 0 && (
          <PersonList
            people={items}
            onSelect={(key) => {
              const person = people.find((p) => p.uuid === key);
              if (person) {
                navigate(`/profile/${key}`, { state: { origin: 'random', person } });
              }
            }}
          />
        )}
      </Stack>
    </Container>
  );
}
