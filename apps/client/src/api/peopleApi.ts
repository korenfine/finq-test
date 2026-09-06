import type { CreatePersonDto, Person, UpdatePersonDto } from '@finq/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333';
const REQUEST_TIMEOUT_MS = 5000;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

function withTimeout(init: RequestInit = {}): RequestInit {
  return { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) };
}

export async function getPeople(): Promise<Person[]> {
  const response = await fetch(`${API_BASE_URL}/people`, withTimeout());
  return handleResponse<Person[]>(response);
}

export async function createPerson(dto: CreatePersonDto): Promise<Person> {
  const response = await fetch(
    `${API_BASE_URL}/people`,
    withTimeout({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }),
  );
  return handleResponse<Person>(response);
}

export async function updatePerson(id: number, dto: UpdatePersonDto): Promise<Person> {
  const response = await fetch(
    `${API_BASE_URL}/people/${id}`,
    withTimeout({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }),
  );
  return handleResponse<Person>(response);
}

export async function deletePerson(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/people/${id}`, withTimeout({ method: 'DELETE' }));
  return handleResponse<void>(response);
}
