import { useEffect, useMemo, useState } from 'react';
import { Group, Pagination, Paper, Stack } from '@mantine/core';
import { IconUsersGroup } from '@tabler/icons-react';
import { EmptyState } from './EmptyState';
import { FilterBar } from './FilterBar';
import { PersonRow, type PersonListItem } from './PersonRow';

const PAGE_SIZE = 10;

interface PersonListProps {
  people: PersonListItem[];
  onSelect: (key: string) => void;
}

export function PersonList({ people, onSelect }: PersonListProps) {
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);

  const countryOptions = useMemo(
    () => Array.from(new Set(people.map((person) => person.country))).sort(),
    [people],
  );

  const filteredPeople = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    return people.filter((person) => {
      const fullName = `${person.title} ${person.firstName} ${person.lastName}`.toLowerCase();
      const matchesName = name === '' || fullName.includes(name);
      const matchesCountry = countryFilter === '' || person.country === countryFilter;
      return matchesName && matchesCountry;
    });
  }, [people, nameFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPeople.length / PAGE_SIZE));

  // Land back on a valid page whenever filtering (or the underlying list) shrinks
  // the result set out from under the page the user was on.
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pagedPeople = filteredPeople.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleClearFilters() {
    setNameFilter('');
    setCountryFilter('');
  }

  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md">
        <FilterBar
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
          countryOptions={countryOptions}
        />
      </Paper>
      {filteredPeople.length === 0 ? (
        <EmptyState
          icon={IconUsersGroup}
          title="No people found"
          description="Try adjusting your search or filters."
          actionLabel="Clear filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <Stack gap="sm">
            {pagedPeople.map((person) => (
              <PersonRow key={person.key} person={person} onClick={() => onSelect(person.key)} />
            ))}
          </Stack>
          {totalPages > 1 && (
            <Group justify="center">
              <Pagination total={totalPages} value={page} onChange={setPage} />
            </Group>
          )}
        </>
      )}
    </Stack>
  );
}
