const createDefineDatabaseMocks = () => {
  const dbImplementation = {
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const databases = {
    mongo: {
      Mongo: jest.fn().mockImplementation(() => dbImplementation),
      mongoStrategy: jest.fn(),
    },
    postgres: {
      Postgres: jest.fn().mockImplementation(() => dbImplementation),
      postgresConnection: jest.fn(),
      postgresStrategy: jest.fn(),
    },
  };

  const defineDatabase = jest.fn().mockReturnValue(databases);

  return { defineDatabase };
};

module.exports = createDefineDatabaseMocks;
