const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

const server = (deps) => async () => {
  const { app, defineDatabase } = deps;

  const { mongoStrategy, postgresStrategy } = await defineDatabase();

  try {
    // app.route([...mapRoutes()]);
    await app.start(`The server is running on port ${app.info.port}`);
    return app;
  } catch (error) {
    throw error;
  }
};

module.exports = server;
