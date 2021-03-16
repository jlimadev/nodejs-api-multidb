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
  };
};

describe('AuthRoutesController test suit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Class test', () => {
    describe('Instance test', () => {
      it('Should be instance of AuthRoutesController', () => {
        const { Sut, deps } = makeSut();
        const authRoutesController = new Sut(deps);
        expect(authRoutesController).toBeInstanceOf(AuthRoutesController);
      });
    });

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
    });

    describe('Failure Cases', () => {
      it('Should return 409 Status [Conflict] if try to registter an user that already exists', async () => {
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

      // it('Should SingIn Successfuly', () => {});

      // it('Should SingOut Successfuly', () => {});
    });
  });
});
