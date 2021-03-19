const request = require('supertest');
const defineEnvironment = require('../../utils/define-environment');

const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const authRoutes = require('.');
const { app, mongoConnection } = require('../..');

const makeSut = () => {
  const mockCallback = jest.fn().mockReturnValue(jest.fn());

  const mockedAuthRoute = {
    signIn: mockCallback,
    signOut: mockCallback,
    signUp: mockCallback,
  };

  const mockedValidations = jest.fn().mockReturnValue({
    celebrateValidateSignIn: mockCallback,
    celebrateValidateSignUp: mockCallback,
  });

  const defaultUser = {
    username: 'anyusername',
    password: 'anypassword',
  };

  const userToSignUp = {
    ...defaultUser,
    passwordConfirmation: 'anypassword',
  };

  const createdUser = {
    _id: 'anyid',
    username: 'anyusername',
  };

  const sut = authRoutes;

  return {
    sut,
    mockedAuthRoute,
    mockedValidations,
    defaultUser,
    userToSignUp,
    createdUser,
  };
};

describe('heroRoutes test suit', () => {
  afterAll(async () => {
    await mongoConnection.close();
  });

  describe('authRoutes function test suit', () => {
    it('Should create a route', async () => {
      const { sut, mockedAuthRoute, mockedValidations } = makeSut();
      const route = sut(mockedAuthRoute, mockedValidations);
      expect(route).toBeInstanceOf(Function);
    });

    it('Should fail if an error happens in authRoutes instance', () => {
      const { sut, mockedValidations } = makeSut();

      const mockedAuthRoute = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const act = () => {
        sut(mockedAuthRoute, mockedValidations);
      };

      expect(act).toThrow();
    });

    it('Should fail if an error happens in authRoutes validations function', () => {
      const { mockedAuthRoute } = makeSut();

      const mockedValidations = jest.fn(() => {
        throw new Error();
      });

      const act = () => {
        sut(mockedAuthRoute, mockedValidations);
      };

      expect(act).toThrow();
    });
  });

  describe('test /auth/signup route', () => {
    it('Should return Status 200 - [Success] when signup successfuly', async () => {
      const { userToSignUp } = makeSut();

      const response = await request(app)
        .post('/auth/signup')
        .send(userToSignUp);

      expect(response.body.username).toBe(userToSignUp.username);
      expect(response.status).toBe(200);
    });
  });
});
