const HeroRoutesController = require('.');

const makeSut = () => {
  const Sut = HeroRoutesController;
  const errorMessage = { message: 'any error' };
  const errorResponse = { statusCode: 500, error: errorMessage };

  const mockedDatabase = {
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockedRequest = {
    query: {
      name: 'any',
      skip: 0,
      limit: 10,
    },
    body: {
      name: 'any name',
      power: 'any power',
    },
    params: {
      id: 'anyId',
    },
  };

  const mockedResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnValue(errorResponse),
  };

  return {
    Sut,
    mockedDatabase,
    mockedRequest,
    mockedResponse,
    errorMessage,
    errorResponse,
  };
};

describe('HeroRoutesController test suit', () => {
  it('Should create an instance of HeroRoutesController', async () => {
    const { Sut, mockedDatabase } = makeSut();

    const heroRoutesController = new Sut(mockedDatabase);
    expect(heroRoutesController).toBeInstanceOf(HeroRoutesController);
  });

  it('Should throw an error if database method "read" fails', async () => {
    const {
      Sut,
      mockedDatabase,
      mockedRequest,
      mockedResponse,
      errorMessage,
      errorResponse,
    } = makeSut();

    mockedDatabase.read = jest.fn().mockRejectedValue(errorMessage);

    const heroRoutesController = new Sut(mockedDatabase);
    const response = await heroRoutesController.list(
      mockedRequest,
      mockedResponse,
    );

    expect(response).toStrictEqual(errorResponse);
    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      error: errorMessage.message,
    });
  });

  it('Should throw an error if database method "create" fails', async () => {
    const {
      Sut,
      mockedDatabase,
      mockedRequest,
      mockedResponse,
      errorMessage,
      errorResponse,
    } = makeSut();
    const heroRoutesController = new Sut(mockedDatabase);

    mockedDatabase.create = jest.fn().mockRejectedValue(errorMessage);

    const response = await heroRoutesController.create(
      mockedRequest,
      mockedResponse,
    );

    expect(response).toStrictEqual(errorResponse);
    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      error: errorMessage.message,
    });
  });
});
