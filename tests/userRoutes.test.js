const request = require('supertest');
const app = require('../app');
const { connectToDB, client } = require('../data/database');

let db;

beforeAll(async () => {
  db = await connectToDB();
});

afterAll(async () => {
  await client.close();
});

describe('GET /api/user', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/user');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
