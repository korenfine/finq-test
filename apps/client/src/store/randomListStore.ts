import { create } from 'zustand';
import type { RandomPerson } from '../api/randomUserApi';

interface RandomListState {
  people: RandomPerson[];
  setPeople: (people: RandomPerson[]) => void;
  updatePersonName: (uuid: string, firstName: string, lastName: string) => void;
  reset: () => void;
}

export const useRandomListStore = create<RandomListState>((set) => ({
  people: [],
  setPeople: (people) => set({ people }),
  updatePersonName: (uuid, firstName, lastName) =>
    set((state) => ({
      people: state.people.map((person) =>
        person.uuid === uuid ? { ...person, firstName, lastName } : person,
      ),
    })),
  reset: () => set({ people: [] }),
}));
