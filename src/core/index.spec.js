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

  it('should throw an error if start app fails', async () => {
    const { sut, deps, errorMessage } = makeSut();

    deps.app.start = jest.fn(() => Promise.reject(new Error(errorMessage)));

    const act = async () => {
      await sut(deps)();
    };

    expect(act).rejects.toThrow(errorMessage);
  });
});
