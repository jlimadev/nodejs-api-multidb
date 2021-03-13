const ContextStrategy = require('../context/ContextStrategy');
const Postgres = require('./postgres');
const authPostgresSchema = require('./schemas/usersSchema');

module.exports = (async () => {
  const authPostgresConnection = Postgres.connect();
  const authPostgresModel = await Postgres.defineModel(
    authPostgresConnection,
    authPostgresSchema,
  );

  const authPostgresInstance = new Postgres(
    authPostgresConnection,
    authPostgresModel,
  );

  const authPostgresStrategy = new ContextStrategy(authPostgresInstance);
  await authPostgresConnection.close();
  return { authPostgresConnection, authPostgresStrategy };
})();
