const Hapi = require('@hapi/hapi');
const defineEnvironment = require('./utils/defineEnvironment');

const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const app = new Hapi.Server({
  port: process.env.PORT,
});

const main = async () => {
  try {
    await app.start(
      console.log(`The server is running on port ${app.info.port}`),
    );
    return app;
  } catch (error) {
    throw error;
  }
};

main();
