const request = require('supertest');
const { app, mongoConnection } = require('../');

describe('Test hero routes', () => {
  afterAll(async () => {
    await mongoConnection.close();
  });
  describe('LIST | GET', () => {
    it('Should return 200 status if list successfuly', async () => {
      const response = await request(app).get('/heroes');
      expect(response.status).toBe(200);
    });

    it('Should return an array if list successfuly', async () => {
      const response = await request(app).get('/heroes');
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
