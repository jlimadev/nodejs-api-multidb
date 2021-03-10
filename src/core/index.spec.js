const server = require('.');

const makeSut = () => {
  const errorMessage = 'Any error message';
  const appMocked = {
    start: jest.fn(),
    info: {
      port: 'any port',
    },
  };
  const deps = {
    app: appMocked,
  };
  const sut = server;
  return { sut, deps, appMocked, errorMessage };
};

describe('App test suite', () => {
  it('should call the server', async () => {
    const { sut, deps, appMocked } = makeSut();
    const result = await sut(deps)();
    expect(result).toStrictEqual(appMocked);
  });
});
