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

  const notFoundResponse = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Invalid username or password',
  };

  const mockedDatabase = {
    db: {
      read: jest.fn().mockReturnValue([bodyResponse]),
      create: jest.fn().mockReturnValue(bodyResponse),
      update: jest.fn().mockReturnValue(updateResponse),
      delete: jest.fn().mockReturnValue(deleteResponse),
    },
  };

  const mockedRequest = {
    query: {
      name: 'any',
      skip: 0,
      limit: 10,
    },
    body: bodyResponse,
    params: {
      id: 'anyId',
    },
  };

  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(successResponse),
  };

  const mockedErrorResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(errorResponse),
  };

  const mockedNotFoundResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(notFoundResponse),
  };

  return {
    Sut,
    mockedDatabase,
    mockedRequest,
    mockedResponse,
    successResponse,
    updateResponse,
    deleteResponse,
    mockedErrorResponse,
    mockedNotFoundResponse,
    errorMessage,
    errorResponse,
    notFoundResponse,
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
      expect(mockedResponse.json).toHaveBeenCalledWith(successResponse.body);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
    });

    it('Should list all successfuly', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedResponse,
        successResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedRequest.query.name = undefined;

      const response = await heroRoutesController.list(
        mockedRequest,
        mockedResponse,
      );

      expect(response).toStrictEqual(successResponse);
      expect(mockedResponse.json).toHaveBeenCalledWith(successResponse.body);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
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
      expect(mockedResponse.json).toHaveBeenCalledWith(successResponse.body[0]);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
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
      expect(mockedResponse.json).toHaveBeenCalledWith(successResponse.body);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
    });

    it('Should delete successfuly', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedResponse,
        successResponse,
        deleteResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      successResponse.body = deleteResponse;

      const response = await heroRoutesController.delete(
        mockedRequest,
        mockedResponse,
      );

      expect(response).toStrictEqual(successResponse);
      expect(mockedResponse.json).toHaveBeenCalledWith(successResponse.body);
      expect(mockedResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Failure cases', () => {
    it('Should return 404 - [Not Found] if read dont find any item', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedNotFoundResponse,
        notFoundResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.db.read = jest.fn().mockReturnValue([]);
      mockedRequest.query.name = 'AnyInvalid';
      mockedRequest.body = [];

      const response = await heroRoutesController.list(
        mockedRequest,
        mockedNotFoundResponse,
      );

      expect(response).toStrictEqual(notFoundResponse);
      expect(mockedNotFoundResponse.status).toHaveBeenCalledWith(404);
      expect(mockedNotFoundResponse.json).toHaveBeenCalledWith(
        notFoundResponse,
      );
    });

    it('Should return 500 - [Bad Request] if database method "read" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();

      mockedDatabase.db.read = jest.fn().mockRejectedValue(errorMessage);

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

    it('Should return 500 - [Bad Request] if database method "create" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.db.create = jest.fn().mockRejectedValue(errorMessage);

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

    it('Should return 500 - [Bad Request] if database method "update" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.db.update = jest.fn().mockRejectedValue(errorMessage);

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

    it('Should return 500 - [Bad Request] if database method "delete" fails', async () => {
      const {
        Sut,
        mockedDatabase,
        mockedRequest,
        mockedErrorResponse,
        errorMessage,
        errorResponse,
      } = makeSut();
      const heroRoutesController = new Sut(mockedDatabase);

      mockedDatabase.db.delete = jest.fn().mockRejectedValue(errorMessage);

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
