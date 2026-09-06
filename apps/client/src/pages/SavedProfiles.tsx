import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Badge, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconBookmark } from '@tabler/icons-react';
import { getPeople } from '../api/peopleApi';
import { queryKeys } from '../api/queryKeys';
import { EmptyState } from '../components/EmptyState';
import { PersonList } from '../components/PersonList';
import { PersonListSkeleton } from '../components/PersonListSkeleton';
import type { PersonListItem } from '../components/PersonRow';

export function SavedProfiles() {
  const navigate = useNavigate();

  const query = useQuery({ queryKey: queryKeys.people, queryFn: getPeople });

  const people = query.data ?? [];
  const items: PersonListItem[] = people.map((person) => ({
    key: String(person.id),
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
        <Stack gap={0}>
          <Group gap="xs" align="center">
            <Title order={2}>Saved Profiles</Title>
            {!query.isLoading && !query.isError && items.length > 0 && (
              <Badge variant="light" size="lg">
                {items.length}
              </Badge>
            )}
          </Group>
          <Text c="dimmed">People you've saved.</Text>
        </Stack>

        {query.isLoading && <PersonListSkeleton />}

        {query.isError && (
          <Alert color="red" icon={<IconAlertCircle size={18} />} title="Unable to load saved profiles">
            Something went wrong while loading your saved profiles.
            <Group mt="sm">
              <Button size="xs" variant="light" color="red" onClick={() => query.refetch()}>
                Try again
              </Button>
            </Group>
          </Alert>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <EmptyState
            icon={IconBookmark}
            title="No saved profiles yet"
            description="Profiles you save will appear here."
            actionLabel="Find people"
            onAction={() => navigate('/random')}
          />
        )}

        {!query.isLoading && !query.isError && items.length > 0 && (
          <PersonList
            people={items}
            onSelect={(key) => {
              const person = people.find((p) => String(p.id) === key);
              if (person) {
                navigate(`/profile/${key}`, { state: { origin: 'saved', person } });
              }
            }}
          />
        )}
      </Stack>
    </Container>
  );
}
