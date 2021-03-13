const HeroRoutesController = require('.');

const makeSut = () => {
  const Sut = HeroRoutesController;
  const errorMessage = { message: 'any error' };
  const errorResponse = { statusCode: 500, error: errorMessage };

  const bodyResponse = { name: 'any name', power: 'any power' };
  const updateResponse = { n: 1, nModified: 1, ok: 1 };
  const deleteResponse = { n: 1, ok: 1, deletedCount: 1 };

  const successResponse = {
    statusCode: 200,
    body: [bodyResponse],
  };

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
    status: jest.fn().mockReturnValue(successResponse),
  };

  const mockedErrorResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnValue(errorResponse),
  };

  return {
    Sut,
    mockedDatabase,
    mockedRequest,
    mockedResponse,
    successResponse,
    updateResponse,
    mockedErrorResponse,
    errorMessage,
    errorResponse,
  };
};

describe('HeroRoutesController test suit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Success cases', () => {
    it('Should create an instance of HeroRoutesController', async () => {
      const { Sut, mockedDatabase } = makeSut();

      const heroRoutesController = new Sut(mockedDatabase);
      expect(heroRoutesController).toBeInstanceOf(HeroRoutesController);
    });

    it('Should list successfuly', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedResponse,
        successResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      const response = await heroRoutesController.list(
        mockedRequest,
        mockedResponse,
      );

      expect(response).toStrictEqual(successResponse);
    });

    it('Should create successfuly', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedResponse,
        successResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      const response = await heroRoutesController.create(
        mockedRequest,
        mockedResponse,
      );

      expect(response).toStrictEqual(successResponse);
    });

    it('Should update successfuly', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedResponse,
        successResponse,
        updateResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      successResponse.body = updateResponse;

      const response = await heroRoutesController.update(
        mockedRequest,
        mockedResponse,
      );

      expect(response).toStrictEqual(successResponse);
    });
  });

  describe('Failure cases', () => {
    it('Should throw an error if database method "read" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();

      mockedDatabase.read = jest.fn().mockRejectedValue(errorMessage);

      const heroRoutesController = new Sut(mockedDatabase);
      const response = await heroRoutesController.list(
        mockedRequest,
        mockedErrorResponse,
      );

      expect(response).toStrictEqual(errorResponse);
      expect(mockedErrorResponse.status).toHaveBeenCalledWith(500);
      expect(mockedErrorResponse.json).toHaveBeenCalledWith({
        error: errorMessage.message,
      });
    });

    it('Should throw an error if database method "create" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.create = jest.fn().mockRejectedValue(errorMessage);

      const response = await heroRoutesController.create(
        mockedRequest,
        mockedErrorResponse,
      );

      expect(response).toStrictEqual(errorResponse);
      expect(mockedErrorResponse.status).toHaveBeenCalledWith(500);
      expect(mockedErrorResponse.json).toHaveBeenCalledWith({
        error: errorMessage.message,
      });
    });

    it('Should throw an error if database method "update" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.update = jest.fn().mockRejectedValue(errorMessage);

      const response = await heroRoutesController.update(
        mockedRequest,
        mockedErrorResponse,
      );

      expect(response).toStrictEqual(errorResponse);
      expect(mockedErrorResponse.status).toHaveBeenCalledWith(500);
      expect(mockedErrorResponse.json).toHaveBeenCalledWith({
        error: errorMessage.message,
      });
    });

    it('Should throw an error if database method "delete" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.delete = jest.fn().mockRejectedValue(errorMessage);

      const response = await heroRoutesController.delete(
        mockedRequest,
        mockedErrorResponse,
      );

      expect(response).toStrictEqual(errorResponse);
      expect(mockedErrorResponse.status).toHaveBeenCalledWith(500);
      expect(mockedErrorResponse.json).toHaveBeenCalledWith({
        error: errorMessage.message,
      });
    });
  });
});
