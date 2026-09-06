import { ActionIcon, Avatar, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './PersonRow.module.css';

export interface PersonListItem {
  key: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  phone: string;
  email: string;
  thumbnailUrl: string;
}

interface PersonRowProps {
  person: PersonListItem;
  onClick: () => void;
}

function genderColor(gender: string): string {
  if (gender === 'female') return 'pink';
  if (gender === 'male') return 'blue';
  return 'gray';
}

export function PersonRow({ person, onClick }: PersonRowProps) {
  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      onClick={onClick}
      className={classes.row}
      style={{ cursor: 'pointer' }}
      data-testid="person-row"
    >
      <div className={classes.grid}>
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <Avatar src={person.thumbnailUrl} size={52} radius="xl" />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <Text fw={500} truncate data-testid="person-name">
              {person.title} {person.firstName} {person.lastName}
            </Text>
            <Text size="sm" c="dimmed" truncate>
              {person.email}
            </Text>
          </Stack>
        </Group>

        <Badge variant="light" color={genderColor(person.gender)} visibleFrom="sm">
          {person.gender}
        </Badge>

        <Text size="sm" truncate visibleFrom="sm">
          {person.country}
        </Text>

        <Text size="sm" c="dimmed" truncate visibleFrom="sm">
          {person.phone}
        </Text>

        <ActionIcon variant="subtle" color="gray">
          <IconChevronRight size={18} />
        </ActionIcon>
      </div>
    </Paper>
  );
}
