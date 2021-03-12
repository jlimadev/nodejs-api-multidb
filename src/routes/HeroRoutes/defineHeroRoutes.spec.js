const defineHeroRoutes = require('./defineHeroRoutes');

const makeSut = () => {
  const mockCallback = jest.fn().mockReturnValue(jest.fn());

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

  const sut = defineHeroRoutes;

  return { sut, mockedHeroRoute, mockedValidations };
};

describe('defineHeroRoutes test suit', () => {
  it('Should create a route', async () => {
    const { mockedHeroRoute, mockedValidations } = makeSut();
    const route = defineHeroRoutes(mockedHeroRoute, mockedValidations);
    expect(route).toBeInstanceOf(Function);
  });

  it('Should fail if an error happens in heroRoutes instance', () => {
    const { mockedValidations } = makeSut();

    const mockedHeroRoute = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const act = () => {
      defineHeroRoutes(mockedHeroRoute, mockedValidations);
    };

    expect(act).toThrow();
  });

  it('Should fail if an error happens in heroRoutes instance', () => {
    const { mockedHeroRoute } = makeSut();

    const mockedValidations = jest.fn(() => {
      throw new Error();
    });

    const act = () => {
      defineHeroRoutes(mockedHeroRoute, mockedValidations);
    };

    expect(act).toThrow();
  });
});
