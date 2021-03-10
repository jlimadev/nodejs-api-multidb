const { handler, deps } = require('.');
const ContextStrategy = require('./db/strategies/context/ContextStrategy');

describe('application handler', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setTimeout(10000);
  });

  it('Should return a promise', () => {
    expect(handler).toBeInstanceOf(Object);
  });

  it('Should return an object with deps', async () => {
    expect(deps).toBeInstanceOf(Object);
    expect(deps.app).toBeInstanceOf(Object);
    expect(deps.defineDatabase).toBeInstanceOf(Function);
  });

  it('define database should return instances of ContextStrategy', async () => {
    const { mongo, postgres } = await deps.defineDatabase();
    const { Mongo, mongoStrategy } = mongo;
    const { Postgres, postgresStrategy, postgresConnection } = postgres;

    expect(mongoStrategy).toBeInstanceOf(ContextStrategy);
    expect(postgresStrategy).toBeInstanceOf(ContextStrategy);

    Mongo.disconnect();
    Postgres.disconnect(postgresConnection);
  });
});
