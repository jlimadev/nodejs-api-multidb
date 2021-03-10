const server = require('.');
const createHapiMocks = require('../utils/tests/createHapiMocks');
const createDefineDatabaseMocks = require('../utils/tests/createDefineDatabaseMocks');

const makeSut = () => {
  const sut = server;
  const errorMessage = 'Any error message';
  const { appMocked } = createHapiMocks();
  const { instancesMock, defineDatabase } = createDefineDatabaseMocks();

  const deps = {
    app: appMocked,
    defineDatabase,
  };

  return { sut, deps, appMocked, instancesMock, errorMessage };
};

describe('App test suite', () => {
  describe('Success cases', () => {
    it('Should call the server successfuly', async () => {
      const { sut, deps, appMocked } = makeSut();
      const result = await sut(deps)();
      expect(result).toStrictEqual(appMocked);
    });
  });

  describe('Failure cases', () => {
    it('should throw an error if start app fails', async () => {
      const { sut, deps, errorMessage } = makeSut();

      deps.app.start = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await sut(deps)();
      };

      expect(act).rejects.toThrow(errorMessage);
    });
  });
});
