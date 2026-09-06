import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconDeviceFloppy,
  IconGenderFemale,
  IconGenderMale,
  IconMail,
  IconMapPin,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import type { CreatePersonDto, UpdatePersonDto } from '@finq/shared-types';
import { usePersonSource, type PersonOrigin } from '../hooks/usePersonSource';
import { useRandomListStore } from '../store/randomListStore';
import { createPerson, deletePerson, updatePerson } from '../api/peopleApi';
import { queryKeys } from '../api/queryKeys';
import { ProfileDetailSkeleton } from '../components/ProfileDetailSkeleton';

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

const ltrFieldStyle = { direction: 'ltr' as const, textAlign: 'left' as const };

export function ProfileDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const source = usePersonSource(id);
  const updateRandomPersonName = useRandomListStore((state) => state.updatePersonName);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const [origin, setOrigin] = useState<PersonOrigin>(source.origin);
  const [dbId, setDbId] = useState<number | undefined>(source.dbId);
  const [personData, setPersonData] = useState<CreatePersonDto | null>(null);
  const [fullName, setFullName] = useState('');
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current && source.person) {
      setOrigin(source.origin);
      setDbId(source.dbId);
      setPersonData(source.person);
      setFullName(`${source.person.firstName} ${source.person.lastName}`.trim());
      seeded.current = true;
    }
  }, [source]);

  const createMutation = useMutation({
    mutationFn: (dto: CreatePersonDto) => createPerson(dto),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      setOrigin('saved');
      setDbId(created.id);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ personId, dto }: { personId: number; dto: UpdatePersonDto }) =>
      updatePerson(personId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (personId: number) => deletePerson(personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      navigate(-1);
    },
  });

  if (source.isLoading || !personData) {
    return (
      <Container size="sm" py="xl">
        <ProfileDetailSkeleton />
      </Container>
    );
  }

  function handleSave() {
    if (!personData) return;
    createMutation.mutate({ ...personData, ...splitFullName(fullName) });
  }

  function handleUpdate() {
    const { firstName, lastName } = splitFullName(fullName);
    if (origin === 'saved' && dbId != null) {
      updateMutation.mutate({ personId: dbId, dto: { firstName, lastName } });
    } else if (source.uuid) {
      updateRandomPersonName(source.uuid, firstName, lastName);
    }
  }

  function handleDelete() {
    if (dbId != null) {
      deleteMutation.mutate(dbId);
    }
  }

  const yearOfBirth = personData.dateOfBirth ? new Date(personData.dateOfBirth).getFullYear() : '—';
  const mutationError = createMutation.error ?? updateMutation.error ?? deleteMutation.error;
  const GenderIcon = personData.gender === 'female' ? IconGenderFemale : IconGenderMale;

  return (
    <div dir="rtl" style={{ direction: 'rtl' }}>
      <Container size="sm" py="xl">
        <Card withBorder radius="lg" p="xl">
          <Group justify="flex-start" mb="md">
            <UnstyledButton onClick={() => navigate(-1)}>
              <Group gap={4}>
                <IconArrowLeft size={16} />
                <Text size="sm">חזרה</Text>
              </Group>
            </UnstyledButton>
          </Group>

          <Stack align="center" gap={4} mb="lg">
            <Avatar src={personData.largePhotoUrl} size={128} radius={128} alt={fullName} />
            <Text fw={600} size="lg" mt="sm">
              {fullName}
            </Text>
            <Text c="dimmed" size="sm" dir="ltr" style={ltrFieldStyle}>
              {personData.email}
            </Text>
            <Group gap={6} mt={4}>
              <Badge variant="light" leftSection={<GenderIcon size={12} />}>
                {personData.gender}
              </Badge>
              <Text size="sm" c="dimmed">
                {personData.age} שנים
              </Text>
            </Group>
          </Stack>

          <Divider my="md" />

          <Stack gap="md">
            <Stack gap="xs">
              <Group gap={6}>
                <IconUser size={16} />
                <Text fw={600} size="sm">
                  מידע אישי
                </Text>
              </Group>
              <Group justify="space-between" wrap="nowrap">
                <Text fw={500}>שם</Text>
                <TextInput
                  value={fullName}
                  onChange={(event) => setFullName(event.currentTarget.value)}
                  dir="ltr"
                  style={ltrFieldStyle}
                  // Mantine's top-level `dir`/`style` props only reach the outer
                  // wrapper <div>, not the actual <input> — `attributes.input`
                  // is the escape hatch that puts `dir="ltr"` on the real
                  // editable element itself, which matters for an editable
                  // cursor in an RTL-wrapped form (not just inherited CSS direction).
                  attributes={{ input: { dir: 'ltr' } }}
                />
              </Group>
              <Group justify="space-between">
                <Text fw={500}>מגדר</Text>
                <Text>{personData.gender}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>גיל</Text>
                <Text>
                  {personData.age} (נולד/ה ב-{yearOfBirth})
                </Text>
              </Group>
            </Stack>

            <Divider />

            <Stack gap="xs">
              <Group gap={6}>
                <IconMapPin size={16} />
                <Text fw={600} size="sm">
                  כתובת
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>מספר רחוב</Text>
                <Text dir="ltr" style={ltrFieldStyle}>
                  {personData.streetNumber}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>רחוב</Text>
                <Text>{personData.streetName}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>עיר</Text>
                <Text>{personData.city}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>מדינה</Text>
                <Text>{personData.state}</Text>
              </Group>
            </Stack>

            <Divider />

            <Stack gap="xs">
              <Group gap={6}>
                <IconMail size={16} />
                <Text fw={600} size="sm">
                  פרטי קשר
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>אימייל</Text>
                <Text dir="ltr" style={ltrFieldStyle}>
                  {personData.email}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>טלפון</Text>
                <Text dir="ltr" style={ltrFieldStyle}>
                  {personData.phone}
                </Text>
              </Group>
            </Stack>
          </Stack>

          {mutationError && (
            <Alert color="red" title="לא ניתן להתחבר לשרת" icon={<IconAlertCircle size={16} />} mt="md">
              {mutationError.message}
            </Alert>
          )}

          <Divider my="md" />

          <Group justify="flex-end">
            {origin === 'random' && (
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSave}
                loading={createMutation.isPending}
              >
                שמור
              </Button>
            )}
            {origin === 'saved' && (
              <Button
                color="red"
                variant="light"
                leftSection={<IconTrash size={16} />}
                onClick={openDeleteModal}
                loading={deleteMutation.isPending}
              >
                מחק
              </Button>
            )}
            <Button variant="light" onClick={handleUpdate} loading={updateMutation.isPending}>
              עדכן
            </Button>
          </Group>
        </Card>
      </Container>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Text dir="rtl" style={{ direction: 'rtl' }} fw={600}>
            למחוק את הפרופיל?
          </Text>
        }
        centered
      >
        <div dir="rtl" style={{ direction: 'rtl' }}>
          <Text size="sm" mb="md">
            האם אתה בטוח שברצונך להסיר את {fullName} מהפרופילים השמורים?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>
              ביטול
            </Button>
            <Button
              color="red"
              onClick={() => {
                closeDeleteModal();
                handleDelete();
              }}
              loading={deleteMutation.isPending}
            >
              מחק פרופיל
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}
