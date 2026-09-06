import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { CreatePersonDto, Person } from '@finq/shared-types';
import { useRandomListStore } from '../store/randomListStore';
import { getPeople } from '../api/peopleApi';
import { queryKeys } from '../api/queryKeys';
import type { RandomPerson } from '../api/randomUserApi';

export type PersonOrigin = 'random' | 'saved';

export interface PersonSourceResult {
  origin: PersonOrigin;
  person?: CreatePersonDto;
  uuid?: string;
  dbId?: number;
  isLoading: boolean;
}

interface NavigationState {
  origin?: PersonOrigin;
  person?: RandomPerson | Person;
}

export function usePersonSource(id: string): PersonSourceResult {
  const location = useLocation();
  const navState = (location.state as NavigationState | null) ?? null;

  const randomPeople = useRandomListStore((state) => state.people);
  const fromRandom = randomPeople.find((person) => person.uuid === id);

  // A profile that arrived via router state, or that's already in the random-list
  // store, never needs the backend at all — the client stays fully standalone for
  // the "fetch random people" flow. The `['people']` query only runs as a fallback
  // (e.g. a direct/refreshed navigation to a saved profile's URL).
  const resolvedWithoutServer =
    (navState?.origin === 'random' && !!navState.person) ||
    (navState?.origin === 'saved' && !!navState.person) ||
    !!fromRandom;

  const peopleQuery = useQuery({
    queryKey: queryKeys.people,
    queryFn: getPeople,
    enabled: !resolvedWithoutServer,
  });

  if (navState?.origin === 'random' && navState.person) {
    const person = navState.person as RandomPerson;
    return { origin: 'random', person, uuid: person.uuid, isLoading: false };
  }

  if (navState?.origin === 'saved' && navState.person) {
    const person = navState.person as Person;
    return { origin: 'saved', person, dbId: person.id, isLoading: false };
  }

  if (fromRandom) {
    return { origin: 'random', person: fromRandom, uuid: fromRandom.uuid, isLoading: false };
  }

  const fromSaved = peopleQuery.data?.find((person) => String(person.id) === id);
  if (fromSaved) {
    return { origin: 'saved', person: fromSaved, dbId: fromSaved.id, isLoading: false };
  }

  return { origin: 'saved', isLoading: peopleQuery.isLoading };
}
