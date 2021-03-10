const Hapi = require('@hapi/hapi');
const ContextStrategy = require('./db/strategies/context/ContextStrategy');
const Mongo = require('./db/strategies/mongodb/mongodb');
const MongoHeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const Postgres = require('./db/strategies/postgres/postgres');
const PostgresHeroesSchema = require('./db/strategies/postgres/schemas/HeroesSchema');
const HeroRoutes = require('./routes/HeroRoutes');

const app = new Hapi.Server({
  port: process.env.PORT,
});

const defineDatabase = async () => {
  const mongoConnection = Mongo.connect();
  const mongoInstance = new Mongo(mongoConnection, MongoHeroesSchema);
  const postgresConnection = await Postgres.connect();
  const mongoStrategy = new ContextStrategy(mongoInstance);

  const postgresModel = await Postgres.defineModel(
    postgresConnection,
    PostgresHeroesSchema,
  );
  const postgresInstance = new Postgres(postgresConnection, postgresModel);
  const postgresStrategy = new ContextStrategy(postgresInstance);

  const heroRoutesInstance = new HeroRoutes(mongoStrategy);

  const instances = {
    mongo: {
      Mongo,
      mongoStrategy,
    },
    postgres: {
      Postgres,
      postgresConnection,
      postgresStrategy,
    },
    routes: {
      HeroRoutes,
      heroRoutesInstance,
    },
  };

  return instances;
};

const deps = {
  app,
  defineDatabase,
};

module.exports.handler = require('./core')(deps);
module.exports.deps = deps;
