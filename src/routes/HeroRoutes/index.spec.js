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

  describe('CREATE | POST', () => {
    it('Should return 200 status if creates successfuly', async () => {
      const response = await request(app).post('/heroes').send(mockInsertHero);
      const { status, body } = response;

      testId = body._id;

      const expectedKeys = ['createdAt', 'name', 'power', '_id', '__v'];
      const resultKeys = Object.keys(body);
      const createdHero = { name: body.name, power: body.power };

      expect(status).toBe(200);
      expect(resultKeys).toEqual(expectedKeys);
      expect(createdHero).toEqual(mockInsertHero);
    });
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

  describe('UPDATE | PATCH ', () => {
    it('Should update the hero by id', async () => {
      const patchObject = { power: 'any updated power' };
      const expectedResponse = { n: 1, nModified: 1, ok: 1 };

      const response = await request(app)
        .patch(`/heroes/${testId}`)
        .send(patchObject);

      expect(response.body).toStrictEqual(expectedResponse);
    });
  });

  describe('DELETE | DELETE ', () => {
    it('Should delete one hero by id', async () => {
      const expectedResponse = { n: 1, ok: 1, deletedCount: 1 };
      const response = await request(app).delete(`/heroes/${testId}`);

      expect(response.body).toStrictEqual(expectedResponse);
    });
  });
});
