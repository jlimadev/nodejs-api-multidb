const createDefineDatabaseMocks = () => {
  const dbImplementation = {
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const methodsMocked = {
    constructor: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
  };

  const routesImplementation = {
    methods: jest.fn(() => ['constructor', 'list', 'create']),
  };

  const instances = {
    mongo: {
      Mongo: jest.fn().mockImplementation(() => dbImplementation),
      mongoStrategy: jest.fn(),
    },
    postgres: {
      Postgres: jest.fn().mockImplementation(() => dbImplementation),
      postgresConnection: jest.fn(),
      postgresStrategy: jest.fn(),
    },
    routes: {
      HeroRoutes: routesImplementation,
      heroRoutesInstance: methodsMocked,
    },
  };

  const defineDatabase = jest.fn().mockReturnValue(instances);

  return { instances, defineDatabase };
};

module.exports = createDefineDatabaseMocks;
