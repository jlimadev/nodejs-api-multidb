const request = require('supertest');
const { app, mongoConnection } = require('./');
let testId = '2a93ef58-95ce-4f19-b0e6-9e2698788a6d';

const mockInsertHero = {
  name: 'any name',
  power: 'any power',
};

describe('Test hero routes', () => {
  afterAll(async () => {
    await mongoConnection.close();
  });

  describe('CREATE | POST', () => {
    describe('Success cases', () => {
      it('Should return [Success] 200 status if creates successfuly', async () => {
        const response = await request(app)
          .post('/heroes')
          .send(mockInsertHero);
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

    describe('Failure cases', () => {
      it('Should return [Bad Request] when create a new hero without a name', async () => {
        const createInvalidHero = { power: 'Any power' };
        const response = await request(app)
          .post('/heroes')
          .send(createInvalidHero);

        const { statusCode, error, validation } = response.body;
        const {
          body: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe('"name" is required');
      });

      it('Should return [Bad Request] when create a hero without power', async () => {
        const createInvalidHero = { name: 'Any hero' };
        const response = await request(app)
          .post('/heroes')
          .send(createInvalidHero);

        const { statusCode, error, validation } = response.body;
        const {
          body: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe('"power" is required');
      });
    });
  });

  describe('LIST | GET', () => {
    describe('Success cases', () => {
      it('Should return 200 status if list successfuly', async () => {
        const response = await request(app).get('/heroes');
        expect(response.status).toBe(200);
      });

      it('Should return an array if list successfuly', async () => {
        const response = await request(app).get('/heroes');
        expect(response.body).toBeInstanceOf(Array);
      });

      it('Should list successfuly using correct query parameters', async () => {
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

    describe('Failure cases', () => {
      it('Should return [Bad Request] when get using incorrect name in query parameters', async () => {
        const LIMIT = 10;
        const SKIP = 0;
        const NAME = 'an';

        const response = await request(app)
          .get('/heroes')
          .query({ limit: LIMIT, skip: SKIP, name: NAME });

        const { statusCode, error, validation } = response.body;
        const {
          query: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe(
          '"name" length must be at least 3 characters long',
        );
      });

      it('Should return [Bad Request] when get using incorrect "limit" in query parameters', async () => {
        const LIMIT = 'limit';
        const SKIP = 0;
        const NAME = 'Any';

        const response = await request(app)
          .get('/heroes')
          .query({ limit: LIMIT, skip: SKIP, name: NAME });

        const { statusCode, error, validation } = response.body;
        const {
          query: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe('"limit" must be a number');
      });

      it('Should return [Bad Request] when get using incorrect "skip" in query parameters', async () => {
        const LIMIT = 0;
        const SKIP = 'skip';
        const NAME = 'Any';

        const response = await request(app)
          .get('/heroes')
          .query({ limit: LIMIT, skip: SKIP, name: NAME });

        const { statusCode, error, validation } = response.body;
        const {
          query: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe('"skip" must be a number');
      });
    });
  });

  describe('UPDATE | PATCH ', () => {
    describe('Success cases', () => {
      it('Should update the hero by id', async () => {
        const patchObject = { power: 'any updated power' };
        const expectedResponse = { n: 1, nModified: 1, ok: 1 };

        const response = await request(app)
          .patch(`/heroes/${testId}`)
          .send(patchObject);

        expect(response.body).toStrictEqual(expectedResponse);
      });
    });

    describe('Failure cases', () => {
      it('Should return [Bad Request] if send an invalid UUID', async () => {
        const patchObject = { power: 'any updated power' };
        const response = await request(app)
          .patch('/heroes/invalidUUID')
          .send(patchObject);

        const { statusCode, error, validation } = response.body;
        const {
          params: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe('"id" must be a valid GUID');
      });

      it('Should return [Bad Request] when send an invalid power inside the body to patch', async () => {
        const patchInvalidObject = { power: 'a' };
        const response = await request(app)
          .patch(`/heroes/${testId}`)
          .send(patchInvalidObject);

        const { statusCode, error, validation } = response.body;
        const {
          body: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe(
          '"power" length must be at least 3 characters long',
        );
      });

      it('Should return [Bad Request] when send an invalid name inside the body to patch', async () => {
        const patchInvalidObject = { name: 'a'.repeat(101) };
        const response = await request(app)
          .patch(`/heroes/${testId}`)
          .send(patchInvalidObject);

        const { statusCode, error, validation } = response.body;
        const {
          body: { message },
        } = validation;

        expect(statusCode).toBe(400);
        expect(error).toBe('Bad Request');
        expect(message).toBe(
          '"name" length must be less than or equal to 100 characters long',
        );
      });
    });
  });

  describe('DELETE | DELETE ', () => {
    it('Should delete one hero by id', async () => {
      const expectedResponse = { n: 1, ok: 1, deletedCount: 1 };
      const response = await request(app).delete(`/heroes/${testId}`);

      expect(response.body).toStrictEqual(expectedResponse);
    });

    it('Should delete all when id is not specified', async () => {
      const manyHeroes = Array(10).fill(mockInsertHero);
      const expectedResponse = { n: 10, ok: 1, deletedCount: 10 };

      /* Insert many heroes with map (async) */
      const promises = manyHeroes.map(async (hero) => {
        return await request(app).post(`/heroes`).send(hero);
      });
      await Promise.all(promises);

      const response = await request(app).delete(`/heroes`);
      expect(response.body).toStrictEqual(expectedResponse);
    });
  });
});
