const mapRoutes = (instance, methods) => {
  return methods.map((method) => {
    instance[method]();
  });
};

const server = (deps) => async () => {
  const { app, defineDatabase } = deps;

  const { mongo, postgres, routes } = await defineDatabase();
  const { heroRoutesInstance, HeroRoutes } = routes;

  try {
    const a = app.route([
      ...mapRoutes(heroRoutesInstance, HeroRoutes.methods()),
    ]);
    console.log(a);
    await app.start(`The server is running on port ${app.info.port}`);
    return app;
  } catch (error) {
    throw error;
  }
};

module.exports = server;
