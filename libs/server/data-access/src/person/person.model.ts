import type { Person } from '@finq/shared-types';

export interface PersonRow {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone: string;
  age: number;
  date_of_birth: string;
  street_number: number;
  street_name: string;
  city: string;
  state: string;
  country: string;
  thumbnail_url: string;
  large_photo_url: string;
  created_at: string;
  updated_at: string;
}

export function rowToPerson(row: PersonRow): Person {
  return {
    id: row.id,
    title: row.title,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    age: row.age,
    dateOfBirth: row.date_of_birth,
    streetNumber: row.street_number,
    streetName: row.street_name,
    city: row.city,
    state: row.state,
    country: row.country,
    thumbnailUrl: row.thumbnail_url,
    largePhotoUrl: row.large_photo_url,
  };
}

export const PERSON_COLUMN_BY_FIELD: Record<string, string> = {
  title: 'title',
  firstName: 'first_name',
  lastName: 'last_name',
  gender: 'gender',
  email: 'email',
  phone: 'phone',
  age: 'age',
  dateOfBirth: 'date_of_birth',
  streetNumber: 'street_number',
  streetName: 'street_name',
  city: 'city',
  state: 'state',
  country: 'country',
  thumbnailUrl: 'thumbnail_url',
  largePhotoUrl: 'large_photo_url',
};
