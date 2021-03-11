const request = require('supertest');
const app = require('../');

describe('Test hero routes', () => {
  it('should return a message', async () => {
    const response = await request(app).get('/heroes');
    expect(response.body.message).toBe('hello world');
  });
});
