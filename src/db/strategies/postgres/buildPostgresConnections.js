const ContextStrategy = require("../context/ContextStrategy");
const Postgres = require("./postgres");
const authPostgresSchema = require("./schemas/authSchema");

module.exports = (() => {
  const authPostgresConnection = Postgres.connect();
  const authPostgresModel = Postgres.defineModel(
    authPostgresConnection,
    authPostgresSchema
  );

  const authPostgresInstance = new Postgres(
    authPostgresConnection,
    authPostgresModel
  );

  const authPostgresStrategy = new ContextStrategy(authPostgresInstance);
  // authPostgresConnection.close();
  return { authPostgresConnection, authPostgresStrategy };
})();
