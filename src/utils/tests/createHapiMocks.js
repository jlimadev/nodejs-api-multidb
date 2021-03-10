const createHapiMocks = () => {
  const appMocked = {
    start: jest.fn(),
    info: {
      port: 'any port',
    },
    route: jest.fn(),
  };

  return { appMocked };
};

module.exports = createHapiMocks;
