process.env.PASSWORD_SALT = 6;
const { hashPassword, comparePassword } = require(".");

let generatedHash = "";

describe("Password Helper test suit", () => {
  describe("hashPassword test", () => {
    it("should hash the password", async () => {
      const result = await hashPassword("anypassword");
      generatedHash = result;
      expect(result.length).toBeGreaterThan(10);
    });
  });

  describe("comparePassword test", () => {
    it("should return true when compare the correct password", async () => {
      const result = await comparePassword("anypassword", generatedHash);
      expect(result).toBe(true);
    });

    it("should return false when compare the incorrect password", async () => {
      const result = await comparePassword("anyinvalidpassword", generatedHash);
      expect(result).toBe(false);
    });
  });
});
