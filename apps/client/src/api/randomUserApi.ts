import type { CreatePersonDto } from '@finq/shared-types';

interface RandomUserApiResult {
  gender: string;
  name: { title: string; first: string; last: string };
  email: string;
  phone: string;
  dob: { age: number; date: string };
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
  };
  picture: { large: string; thumbnail: string };
  login: { uuid: string };
}

interface RandomUserApiResponse {
  results: RandomUserApiResult[];
}

export interface RandomPerson extends CreatePersonDto {
  uuid: string;
}

function mapToRandomPerson(result: RandomUserApiResult): RandomPerson {
  return {
    uuid: result.login.uuid,
    title: result.name.title,
    firstName: result.name.first,
    lastName: result.name.last,
    gender: result.gender,
    email: result.email,
    phone: result.phone,
    age: result.dob.age,
    dateOfBirth: result.dob.date,
    streetNumber: result.location.street.number,
    streetName: result.location.street.name,
    city: result.location.city,
    state: result.location.state,
    country: result.location.country,
    thumbnailUrl: result.picture.thumbnail,
    largePhotoUrl: result.picture.large,
  };
}

export async function fetchRandomUsers(count = 10): Promise<RandomPerson[]> {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch random users: ${response.status}`);
  }
  const data: RandomUserApiResponse = await response.json();
  return data.results.map(mapToRandomPerson);
}
