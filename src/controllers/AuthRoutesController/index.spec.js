const AuthRoutesController = require('.');

const makeSut = () => {
  const mockedHash =
    '$2y$05$cmYIl0CILADBAhT/qNbtRuALzclb60uBVlJIc0ypJOBCNg/V56emK';

  const defaultUser = {
    username: 'anyusername',
    password: 'anypassword',
  };

  const hashedDefaultUser = {
    ...defaultUser,
    password: mockedHash,
  };

  const createdUser = {
    _id: 'anyid',
    username: 'anyusername',
  };

  const mockedRequest = {
    body: hashedDefaultUser,
  };

  const successResponse = {
    statusCode: 200,
    body: createdUser,
  };

  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(successResponse),
  };

  const errorMessage = { message: 'any error' };
  const errorResponse = { statusCode: 500, error: errorMessage };
  const mockedErrorResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(errorResponse),
  };

  const mockedDatabase = {
    read: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(createdUser),
  };

  const mockedPasswordHelper = {
    comparePassword: jest.fn(),
    hashPassword: jest.fn().mockReturnValue(mockedHash),
  };

  const mockedJwtSign = jest.fn().mockReturnValue('Any token');

  const deps = {
    secret: 'Any secret',
    db: mockedDatabase,
    passwordHelper: mockedPasswordHelper,
    jwtSign: mockedJwtSign,
  };

  const Sut = AuthRoutesController;

  return {
    Sut,
    deps,
    mockedRequest,
    mockedResponse,
    successResponse,
    hashedDefaultUser,
    createdUser,
    errorMessage,
    errorResponse,
    mockedErrorResponse,
  };
};

describe('AuthRoutesController test suit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Instance test', () => {
    it('Should be instance of AuthRoutesController', () => {
      const { Sut, deps } = makeSut();
      const authRoutesController = new Sut(deps);
      expect(authRoutesController).toBeInstanceOf(AuthRoutesController);
    });
  });

  describe('SignUp Test Suit', () => {
    describe('Success Cases', () => {
      it('Should return 200 Status [Success] to create a new user', async () => {
        const {
          Sut,
          deps,
          mockedRequest,
          mockedResponse,
          successResponse,
          createdUser,
        } = makeSut();

        const authRoutesController = new Sut(deps);
        const response = await authRoutesController.signUp(
          mockedRequest,
          mockedResponse,
        );

        expect(response).toStrictEqual(successResponse);
        expect(mockedResponse.json).toHaveBeenCalledWith(createdUser);
        expect(mockedResponse.status).toHaveBeenCalledWith(200);
      });

      describe('Failure Cases', () => {
        it('Should return 409 Status [Conflict] if try to register an user that already exists', async () => {
          const {
            Sut,
            deps,
            mockedRequest,
            mockedResponse,
            successResponse,
            hashedDefaultUser,
          } = makeSut();

          deps.db.read = jest.fn().mockResolvedValue([hashedDefaultUser]);

          const authRoutesController = new Sut(deps);
          const response = await authRoutesController.signUp(
            mockedRequest,
            mockedResponse,
          );

          const errorMessage = {
            statusCode: 409,
            error: 'Conflict',
            message: 'This user already exists',
          };

          expect(response).toStrictEqual(successResponse);
          expect(mockedResponse.json).toHaveBeenCalledWith(errorMessage);
          expect(mockedResponse.status).toHaveBeenCalledWith(409);
        });

        it('Should return 500 Status [Internal Server Error] if an error occurs in the process', async () => {
          const {
            Sut,
            deps,
            mockedRequest,
            errorMessage,
            errorResponse,
            mockedErrorResponse,
          } = makeSut();

          deps.db.read = jest.fn().mockRejectedValue(errorMessage);

          const authRoutesController = new Sut(deps);

          const response = await authRoutesController.signUp(
            mockedRequest,
            mockedErrorResponse,
          );

          expect(response).toStrictEqual(errorResponse);
          expect(mockedErrorResponse.json).toHaveBeenCalledWith({
            message: errorMessage.message,
          });
          expect(mockedErrorResponse.status).toHaveBeenCalledWith(500);
        });
      });
    });
  });
});
