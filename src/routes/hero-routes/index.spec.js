const request = require('supertest');
const defineEnvironment = require('../../utils/define-environment');

const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const heroRoutes = require('.');
const { app, mongoConnection } = require('../..');

let testId = '2a93ef58-95ce-4f19-b0e6-9e2698788a6d';

const makeSut = () => {
  const mockCallback = jest.fn().mockReturnValue(jest.fn());

  const mockedCheckAuthentication = jest.fn((req, res, next) => next());

  const mockedHeroRoute = {
    list: mockCallback,
    create: mockCallback,
    update: mockCallback,
    delete: mockCallback,
  };

  const mockedValidations = jest.fn().mockReturnValue({
    celebrateValidateGet: mockCallback,
    celebrateValidatePost: mockCallback,
    celebrateValidatePatch: mockCallback,
    celebrateValidateDelete: mockCallback,
  });

  const sut = heroRoutes;

  const mockedToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFueXVzZXJuYW1lIiwiaWQiOiJjN2IxMmE3MS1lYjFmLTRlZWItOTIwNS04Mjc2ZDk3OTRiNDMiLCJpYXQiOjE2MTU4OTUwMDJ9.LsjDdUvTWYeX2Z__OMj85j8Mz0Z5LHkOOe_WnzaeFec';

  const mockInsertHero = {
    name: 'any name',
    power: 'any power',
  };

  return {
    sut,
    mockedCheckAuthentication,
    mockedHeroRoute,
    mockedValidations,
    mockedToken,
    mockInsertHero,
  };
};

describe('heroRoutes test suit', () => {
  afterAll(async () => {
    await mongoConnection.close();
  });

  describe('heroRoutes function test suit', () => {
    it('Should create a route', async () => {
      const {
        sut,
        mockedCheckAuthentication,
        mockedHeroRoute,
        mockedValidations,
      } = makeSut();
      const route = sut(
        mockedCheckAuthentication,
        mockedHeroRoute,
        mockedValidations,
      );
      expect(route).toBeInstanceOf(Function);
    });

    it('Should fail if an error happens in heroRoutes instance', () => {
      const { sut, mockedCheckAuthentication, mockedValidations } = makeSut();

      const mockedHeroRoute = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const act = () => {
        sut(mockedCheckAuthentication, mockedHeroRoute, mockedValidations);
      };

      expect(act).toThrow();
    });

    it('Should fail if an error happens in heroRoutes validations function', () => {
      const { sut, mockedCheckAuthentication, mockedHeroRoute } = makeSut();

      const mockedValidations = jest.fn(() => {
        throw new Error();
      });

      const act = () => {
        sut(mockedCheckAuthentication, mockedHeroRoute, mockedValidations);
      };

      expect(act).toThrow();
    });
  });

  describe('test /heroes route', () => {
    describe('CREATE | POST', () => {
      describe('Success cases', () => {
        it('Should return 201 status [Created] if creates successfuly', async () => {
          const { mockedToken, mockInsertHero } = makeSut();
          const response = await request(app)
            .post('/heroes')
            .send(mockInsertHero)
            .set('Authorization', `Bearer ${mockedToken}`);
          const { status, body } = response;

          testId = body._id;

          const expectedKeys = ['createdAt', 'name', 'power', '_id', '__v'];
          const resultKeys = Object.keys(body);
          const createdHero = { name: body.name, power: body.power };

          expect(status).toBe(201);
          expect(resultKeys).toEqual(expectedKeys);
          expect(createdHero).toEqual(mockInsertHero);
        });
      });

      describe('Failure cases', () => {
        it('Should return 400 Status [Bad Request] when create a new hero without a name', async () => {
          const { mockedToken } = makeSut();
          const createInvalidHero = { power: 'Any power' };
          const response = await request(app)
            .post('/heroes')
            .send(createInvalidHero)
            .set('Authorization', `Bearer ${mockedToken}`);
          const { statusCode, error, validation } = response.body;
          const {
            body: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"name" is required');
        });

        it('Should return 400 Status [Bad Request] when create a hero without power', async () => {
          const { mockedToken } = makeSut();
          const createInvalidHero = { name: 'Any hero' };
          const response = await request(app)
            .post('/heroes')
            .send(createInvalidHero)
            .set('Authorization', `Bearer ${mockedToken}`);
          const { statusCode, error, validation } = response.body;
          const {
            body: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"power" is required');
        });

        it('Should return 401 Status [Unauthorized] when try to create a hero without sending token', async () => {
          const { mockInsertHero } = makeSut();
          const response = await request(app)
            .post('/heroes')
            .send(mockInsertHero);
          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('JWT token is missing');
        });

        it('Should return 401 Status [Unauthorized] when try to create a hero with a invalid token', async () => {
          const { mockInsertHero } = makeSut();
          const response = await request(app)
            .post('/heroes')
            .send(mockInsertHero)
            .set('Authorization', 'Bearer InvalidToken');
          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('Invalid JWT Token');
        });
      });
    });

    describe('LIST | GET', () => {
      describe('Success cases', () => {
        it('Should return 200 status [Success] if list successfuly', async () => {
          const { mockedToken } = makeSut();
          const response = await request(app)
            .get('/heroes')
            .set('Authorization', `Bearer ${mockedToken}`);
          expect(response.status).toBe(200);
        });

        it('Should return an array if list successfuly', async () => {
          const { mockedToken } = makeSut();
          const response = await request(app)
            .get('/heroes')
            .set('Authorization', `Bearer ${mockedToken}`);
          expect(response.body).toBeInstanceOf(Array);
        });

        it('Should list successfuly using correct query parameters', async () => {
          const { mockedToken, mockInsertHero } = makeSut();

          const LIMIT = 10;
          const SKIP = 0;
          const NAME = 'any';

          const response = await request(app)
            .get('/heroes')
            .query({ limit: LIMIT, skip: SKIP, name: NAME })
            .set('Authorization', `Bearer ${mockedToken}`);

          const [firstHero] = response.body;
          const listedHero = { name: firstHero.name, power: firstHero.power };

          expect(response.body).toBeInstanceOf(Array);
          expect(listedHero).toEqual(mockInsertHero);
        });
      });

      describe('Failure cases', () => {
        it('Should return 400 Status [Bad Request] when get using incorrect name in query parameters', async () => {
          const { mockedToken } = makeSut();

          const LIMIT = 10;
          const SKIP = 0;
          const NAME = 'an';

          const response = await request(app)
            .get('/heroes')
            .query({ limit: LIMIT, skip: SKIP, name: NAME })
            .set('Authorization', `Bearer ${mockedToken}`);

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

        it('Should return 400 Status [Bad Request] when get using incorrect "limit" in query parameters', async () => {
          const { mockedToken } = makeSut();

          const LIMIT = 'limit';
          const SKIP = 0;
          const NAME = 'Any';

          const response = await request(app)
            .get('/heroes')
            .query({ limit: LIMIT, skip: SKIP, name: NAME })
            .set('Authorization', `Bearer ${mockedToken}`);

          const { statusCode, error, validation } = response.body;
          const {
            query: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"limit" must be a number');
        });

        it('Should return 400 Status [Bad Request] when get using incorrect "skip" in query parameters', async () => {
          const { mockedToken } = makeSut();

          const LIMIT = 0;
          const SKIP = 'skip';
          const NAME = 'Any';

          const response = await request(app)
            .get('/heroes')
            .query({ limit: LIMIT, skip: SKIP, name: NAME })
            .set('Authorization', `Bearer ${mockedToken}`);

          const { statusCode, error, validation } = response.body;
          const {
            query: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"skip" must be a number');
        });

        it('Should return 401 Status [Unauthorized] when try to list a hero without sending token', async () => {
          const { mockInsertHero } = makeSut();
          const response = await request(app)
            .get('/heroes')
            .send(mockInsertHero);

          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('JWT token is missing');
        });

        it('Should return 401 Status [Unauthorized] when try to create a hero with a invalid token', async () => {
          const { mockInsertHero } = makeSut();
          const response = await request(app)
            .get('/heroes')
            .send(mockInsertHero)
            .set('Authorization', 'Bearer InvalidToken');

          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('Invalid JWT Token');
        });
      });
    });

    describe('UPDATE | PATCH ', () => {
      describe('Success cases', () => {
        it('Should update the hero by id', async () => {
          const { mockedToken } = makeSut();
          const patchObject = { power: 'any updated power' };
          const expectedResponse = { n: 1, nModified: 1, ok: 1 };

          const response = await request(app)
            .patch(`/heroes/${testId}`)
            .send(patchObject)
            .set('Authorization', `Bearer ${mockedToken}`);

          const { n, nModified, ok } = response.body;
          const responseBodyContaining = { n, nModified, ok };

          expect(responseBodyContaining).toStrictEqual(expectedResponse);
        });
      });

      describe('Failure cases', () => {
        it('Should return 400 Status [Bad Request] if send an invalid UUID', async () => {
          const { mockedToken } = makeSut();
          const patchObject = { power: 'any updated power' };
          const response = await request(app)
            .patch('/heroes/invalidUUID')
            .send(patchObject)
            .set('Authorization', `Bearer ${mockedToken}`);

          const { statusCode, error, validation } = response.body;
          const {
            params: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"id" must be a valid GUID');
        });

        it('Should return 400 Status [Bad Request] when send an invalid power inside the body to patch', async () => {
          const { mockedToken } = makeSut();
          const patchInvalidObject = { power: 'a' };
          const response = await request(app)
            .patch(`/heroes/${testId}`)
            .send(patchInvalidObject)
            .set('Authorization', `Bearer ${mockedToken}`);

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

        it('Should return 400 Status [Bad Request] when send an invalid name inside the body to patch', async () => {
          const { mockedToken } = makeSut();
          const patchInvalidObject = { name: 'a'.repeat(101) };
          const response = await request(app)
            .patch(`/heroes/${testId}`)
            .send(patchInvalidObject)
            .set('Authorization', `Bearer ${mockedToken}`);

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

        it('Should return 401 Status [Unauthorized] when try to patch a hero without sending token', async () => {
          const patchObject = { power: 'any updated power' };

          const response = await request(app)
            .patch(`/heroes/${testId}`)
            .send(patchObject);

          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('JWT token is missing');
        });

        it('Should return 401 Status [Unauthorized] when try to patch a hero with a invalid token', async () => {
          const patchObject = { power: 'any updated power' };
          const response = await request(app)
            .patch(`/heroes/${testId}`)
            .send(patchObject)
            .set('Authorization', 'Bearer InvalidToken');
          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('Invalid JWT Token');
        });
      });
    });

    describe('DELETE | DELETE ', () => {
      describe('Success cases', () => {
        it('Should delete one hero by id', async () => {
          const { mockedToken } = makeSut();
          const expectedResponse = { n: 1, ok: 1, deletedCount: 1 };
          const response = await request(app)
            .delete(`/heroes/${testId}`)
            .set('Authorization', `Bearer ${mockedToken}`);

          const { n, deletedCount, ok } = response.body;
          const responseBodyContaining = { n, deletedCount, ok };

          expect(responseBodyContaining).toStrictEqual(expectedResponse);
        });

        it('Should delete all when id is not specified', async () => {
          const { mockedToken, mockInsertHero } = makeSut();
          const manyHeroes = Array(10).fill(mockInsertHero);
          const expectedResponse = { n: 10, ok: 1, deletedCount: 10 };

          /* Insert many heroes with map (async) */
          const promises = manyHeroes.map(async (hero) => {
            const data = await request(app)
              .post('/heroes')
              .send(hero)
              .set('Authorization', `Bearer ${mockedToken}`);

            return data;
          });
          await Promise.all(promises);

          const response = await request(app)
            .delete('/heroes')
            .set('Authorization', `Bearer ${mockedToken}`);

          const { n, deletedCount, ok } = response.body;
          const responseBodyContaining = { n, deletedCount, ok };

          expect(responseBodyContaining).toStrictEqual(expectedResponse);
        });
      });

      describe('Failure cases', () => {
        it('Should return 400 Status [Bad Request] if try to delete an specif id but it is not an UUID', async () => {
          const { mockedToken } = makeSut();
          const response = await request(app)
            .delete('/heroes/invalidUUID')
            .set('Authorization', `Bearer ${mockedToken}`);

          const { statusCode, error, validation } = response.body;

          const {
            params: { message },
          } = validation;

          expect(statusCode).toBe(400);
          expect(error).toBe('Bad Request');
          expect(message).toBe('"id" must be a valid GUID');
        });

        it('Should return 401 Status [Unauthorized] when try to delete a hero without sending token', async () => {
          const response = await request(app).delete(`/heroes/${testId}`);

          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('JWT token is missing');
        });

        it('Should return 401 Status [Unauthorized] when try to delete a hero with a invalid token', async () => {
          const response = await request(app)
            .delete(`/heroes/${testId}`)
            .set('Authorization', 'Bearer InvalidToken');
          const { statusCode, error, message } = response.body;

          expect(statusCode).toBe(401);
          expect(error).toBe('Unauthorized');
          expect(message).toBe('Invalid JWT Token');
        });
      });
    });
  });
});
