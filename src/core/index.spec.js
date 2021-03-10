const server = require('.');
// jest.mock('@hapi/hapi');

const makeSut = () => {
  const appMocked = {
    start: jest.fn(),
    info: {
      port: 'any port',
    },
  };
  const deps = {
    app: appMocked,
  };
  const sut = server(deps);

  return { sut, deps };
};

describe('App test suite', () => {
  it('should call the server', async () => {
    const { sut } = makeSut();
    await sut();
  });
});
