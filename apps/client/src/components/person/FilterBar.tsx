import { useEffect, useState } from 'react';
import { Group, Select, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

interface FilterBarProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  countryOptions: string[];
}

export function FilterBar({
  nameFilter,
  onNameFilterChange,
  countryFilter,
  onCountryFilterChange,
  countryOptions,
}: FilterBarProps) {
  const [nameInput, setNameInput] = useState(nameFilter);
  const [debouncedName] = useDebouncedValue(nameInput, 300);

  // Name filtering is debounced by 300ms so the (card-based) list isn't
  // re-filtered/re-rendered on every keystroke; country uses a Select of the
  // countries actually present, so it filters immediately with no debounce.
  useEffect(() => {
    onNameFilterChange(debouncedName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  // Re-sync the local echo when the filter is reset externally (e.g. the
  // "Clear filters" action in PersonList), so the input visibly clears too.
  useEffect(() => {
    setNameInput(nameFilter);
  }, [nameFilter]);

  return (
    <Group>
      <TextInput
        placeholder="Search by name"
        leftSection={<IconSearch size={16} />}
        value={nameInput}
        onChange={(event) => setNameInput(event.currentTarget.value)}
        style={{ flex: 1 }}
      />
      <Select
        placeholder="All countries"
        data={countryOptions}
        value={countryFilter || null}
        onChange={(value) => onCountryFilterChange(value ?? '')}
        clearable
        w={220}
      />
    </Group>
  );
}
