import type { ComponentType } from 'react';
import { Button, Stack, Text, ThemeIcon, Title } from '@mantine/core';

interface EmptyStateProps {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl">
      <ThemeIcon variant="light" size={56} radius="xl" color="gray">
        <Icon size={28} />
      </ThemeIcon>
      <Title order={4}>{title}</Title>
      <Text c="dimmed" size="sm" ta="center" maw={360}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button variant="light" mt="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
