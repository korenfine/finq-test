import request from 'supertest';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from '../../apps/server/src/app.js';

describe('People API (integration)', () => {
  const app = createApp(new DatabaseSync(':memory:'));

  const samplePerson = {
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    email: 'john.doe@example.com',
    phone: '555-1234',
    age: 30,
    dateOfBirth: '1994-01-01T00:00:00Z',
    streetNumber: 12,
    streetName: 'Main St',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    largePhotoUrl: 'https://example.com/large.jpg',
  };

  it('performs a full create -> list -> update -> delete lifecycle', async () => {
    const createRes = await request(app).post('/people').send(samplePerson);
    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject(samplePerson);
    const id = createRes.body.id;

    const listRes = await request(app).get('/people');
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const patchRes = await request(app).patch(`/people/${id}`).send({ firstName: 'Jonathan' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.firstName).toBe('Jonathan');

    const deleteRes = await request(app).delete(`/people/${id}`);
    expect(deleteRes.status).toBe(204);

    const finalListRes = await request(app).get('/people');
    expect(finalListRes.body).toHaveLength(0);
  });

  it('returns 400 for an invalid create payload', async () => {
    const res = await request(app).post('/people').send({ firstName: 'OnlyFirstName' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 404 when updating a non-existent person', async () => {
    const res = await request(app).patch('/people/999999').send({ firstName: 'Ghost' });
    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting a non-existent person', async () => {
    const res = await request(app).delete('/people/999999');
    expect(res.status).toBe(404);
  });
});
