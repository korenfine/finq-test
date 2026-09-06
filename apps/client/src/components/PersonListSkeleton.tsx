import { Group, Paper, Skeleton, Stack } from '@mantine/core';

interface PersonListSkeletonProps {
  rows?: number;
}

export function PersonListSkeleton({ rows = 6 }: PersonListSkeletonProps) {
  return (
    <Stack gap="sm">
      {Array.from({ length: rows }).map((_, index) => (
        <Paper key={index} withBorder radius="md" p="md">
          <Group gap="sm" wrap="nowrap">
            <Skeleton circle height={52} />
            <Stack gap={6} style={{ flex: 1 }}>
              <Skeleton height={14} width="40%" />
              <Skeleton height={10} width="60%" />
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
