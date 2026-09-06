import { Card, Divider, Skeleton, Stack } from '@mantine/core';

export function ProfileDetailSkeleton() {
  return (
    <Card withBorder radius="lg" p="xl">
      <Stack align="center" gap="xs" mb="lg">
        <Skeleton circle height={128} />
        <Skeleton height={16} width={160} mt="sm" />
        <Skeleton height={12} width={200} />
      </Stack>
      <Divider my="md" />
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <Stack gap="xs" key={sectionIndex} mb="md">
          <Skeleton height={12} width={100} />
          <Skeleton height={14} />
          <Skeleton height={14} width="80%" />
        </Stack>
      ))}
    </Card>
  );
}
