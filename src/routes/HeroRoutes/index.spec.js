const request = require('supertest');
const { app, mongoConnection } = require('../');

let testId = '';

const mockInsertHero = {
  name: 'any name',
  power: 'any power',
};

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

    it('Should list using query', async () => {
      const LIMIT = 10;
      const SKIP = 0;
      const NAME = 'any';

      const response = await request(app)
        .get('/heroes')
        .query({ limit: LIMIT, skip: SKIP, name: NAME });

      const [firstHero] = response.body;
      const listedHero = { name: firstHero.name, power: firstHero.power };

      expect(response.body).toBeInstanceOf(Array);
      expect(listedHero).toEqual(mockInsertHero);
    });
  });
});
