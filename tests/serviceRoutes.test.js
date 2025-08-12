const request = require('supertest');
const app = require('../app');
const { connectToDB, client } = require('../data/database');

let db;
const TEST_BUSINESS_ID = '689a66700b0ffefbbd9f8fc1'; // from your example

beforeAll(async () => {
  db = await connectToDB();
});

afterAll(async () => {
  await client.close();
});

describe('GET /api/services/business/:businessId', () => {
  it('should return services for a given businessId', async () => {
    const res = await request(app).get(`/api/services/business/${TEST_BUSINESS_ID}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
