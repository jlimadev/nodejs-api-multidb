const defineEnvironment = require('../utils/defineEnvironment');

const server = (deps) => async () => {
  const { app } = deps;

  const env = process.env.NODE_ENV || 'devl';
  defineEnvironment(env);

  try {
    await app.start(
      console.log(`The server is running on port ${app.info.port}`),
    );
    return app;
  } catch (error) {
    throw error;
  }
};

module.exports = server;
