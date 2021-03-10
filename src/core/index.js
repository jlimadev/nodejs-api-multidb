const server = (deps) => async () => {
  const { app } = deps;

  try {
    await app.start(`The server is running on port ${app.info.port}`);
    return app;
  } catch (error) {
    throw error;
  }
};

module.exports = server;
