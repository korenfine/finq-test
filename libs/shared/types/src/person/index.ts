import { z } from 'zod';

export const personSchema = z.object({
  id: z.number(),
  title: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.string(),
  email: z.string().email(),
  phone: z.string(),
  age: z.number(),
  dateOfBirth: z.string(),
  streetNumber: z.number(),
  streetName: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  thumbnailUrl: z.string(),
  largePhotoUrl: z.string(),
});

export type Person = z.infer<typeof personSchema>;

export const createPersonSchema = personSchema.omit({ id: true });

export type CreatePersonDto = z.infer<typeof createPersonSchema>;

export const updatePersonSchema = createPersonSchema.partial();

export type UpdatePersonDto = z.infer<typeof updatePersonSchema>;
