const defineEnvironment = require('../../utils/define-environment');
const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const authRoutes = require('.');
const request = require('supertest');
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

  const sut = authRoutes;

  return { sut, mockedAuthRoute, mockedValidations };
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
});
