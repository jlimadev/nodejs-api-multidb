const heroRoutes = require('.');

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

  const sut = heroRoutes;

  return { sut, mockedHeroRoute, mockedValidations };
};

describe('heroRoutes test suit', () => {
  it('Should create a route', async () => {
    const { sut, mockedHeroRoute, mockedValidations } = makeSut();
    const route = sut(mockedHeroRoute, mockedValidations);
    expect(route).toBeInstanceOf(Function);
  });

  it('Should fail if an error happens in heroRoutes instance', () => {
    const { sut, mockedValidations } = makeSut();

    const mockedHeroRoute = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const act = () => {
      sut(mockedHeroRoute, mockedValidations);
    };

    expect(act).toThrow();
  });

  it('Should fail if an error happens in heroRoutes validations function', () => {
    const { mockedHeroRoute } = makeSut();

    const mockedValidations = jest.fn(() => {
      throw new Error();
    });

    const act = () => {
      sut(mockedHeroRoute, mockedValidations);
    };

    expect(act).toThrow();
  });
});
