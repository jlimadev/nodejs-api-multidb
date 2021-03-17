const { config } = require('dotenv');
const { join } = require('path');

const defineEnvironment = (env) => {
  const checkEnvironment = /^devl$|prod$|test$/;
  if (!checkEnvironment.test(env)) {
    throw new Error(
      `[INVALID ENVIRONMENT] - ${env} is invalid. Must be "prod" or "devl"`,
    );
  }

  const configPath = join(__dirname, '../../config', `.env.${env}`);
  config({
    path: configPath,
  });

  const message = `Successfuly set the environment to ${env}`;

  return message;
};

module.exports = defineEnvironment;
