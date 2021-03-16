const { hash, compare } = require("bcrypt");
const { promisify } = require("util");

const asyncHash = promisify(hash);
const asyncCompare = promisify(compare);

const SALT = parseInt(process.env.PASSWORD_SALT, 10);

const hashPassword = (password) => asyncHash(password, SALT);

const comparePassword = (password, hashedPassword) =>
  asyncCompare(password, hashedPassword);

module.exports = { hashPassword, comparePassword };
