const createHapiMocks = () => {
  const appMocked = {
    start: jest.fn(),
    info: {
      port: 'any port',
    },
  };

  return { appMocked };
};

module.exports = createHapiMocks;
