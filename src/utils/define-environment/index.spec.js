const defineEnvironment = require(".");

describe("defineEnvironment test suit", () => {
  describe("Invalid environment cases", () => {
    it("Should throw an error if the environment is undefined", () => {
      const expectedErrorMessage =
        '[INVALID ENVIRONMENT] - undefined is invalid. Must be "prod" or "devl"';

      try {
        defineEnvironment();
      } catch (error) {
        expect(error.message).toEqual(expectedErrorMessage);
      }
    });

    it("Should throw an error if the environment is invalid", () => {
      const env = "anyOther";
      const expectedErrorMessage = `[INVALID ENVIRONMENT] - ${env} is invalid. Must be "prod" or "devl"`;

      try {
        defineEnvironment(env);
      } catch (error) {
        expect(error.message).toEqual(expectedErrorMessage);
      }
    });
  });

  describe("Valid environments", () => {
    it("Should set the environment to devl", () => {
      const env = "devl";
      const expectedSuccessMessage = `Successfuly set the environment to ${env}`;
      const result = defineEnvironment(env);

      expect(result).toEqual(expectedSuccessMessage);
    });

    it("Should set the environment to prod", () => {
      const env = "prod";
      const expectedSuccessMessage = `Successfuly set the environment to ${env}`;
      const result = defineEnvironment(env);

      expect(result).toEqual(expectedSuccessMessage);
    });
  });
});
