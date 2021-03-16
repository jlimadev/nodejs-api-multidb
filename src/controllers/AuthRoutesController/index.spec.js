const AuthRoutesController = require(".");

const makeSut = () => {
  const mockedHash =
    "$2y$05$cmYIl0CILADBAhT/qNbtRuALzclb60uBVlJIc0ypJOBCNg/V56emK";

  const defaultUser = {
    username: "anyusername",
    password: "anypassword",
  };

  const bodyResponse = [
    {
      ...defaultUser,
      password: mockedHash,
    },
  ];

  const mockedDatabase = {
    read: jest.fn().mockReturnValue(bodyResponse),
  };

  const mockedPasswordHelper = {
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockedJwtSign = jest.fn().mockReturnValue("Any token");

  const deps = {
    secret: "Any secret",
    db: mockedDatabase,
    passwordHelper: mockedPasswordHelper,
    jwtSign: mockedJwtSign,
  };

  const Sut = AuthRoutesController;

  return { Sut, deps };
};

describe("AuthRoutesController test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Class test", () => {
    it("Should be instance of AuthRoutesController", () => {
      const { Sut, deps } = makeSut();
      const authRoutesController = new Sut(deps);
      expect(authRoutesController).toBeInstanceOf(AuthRoutesController);
    });
  });
});
