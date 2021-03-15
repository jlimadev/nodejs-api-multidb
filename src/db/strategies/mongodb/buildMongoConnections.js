const { v4 } = require('uuid');
const ContextStrategy = require('../context/ContextStrategy');
const MongoDB = require('./mongodb');
const mongoHeroesSchema = require('./schemas/heroesSchema');
const mongoAuthSchema = require('./schemas/authSchema');

module.exports = (() => {
  const mongoConnection = MongoDB.connect();

  const authMongoInstance = new MongoDB(mongoConnection, mongoAuthSchema, v4);

  const heroesMongoInstance = new MongoDB(
    mongoConnection,
    mongoHeroesSchema,
    v4,
  );

  const authMongoStrategy = new ContextStrategy(authMongoInstance);
  const heroesMongoStrategy = new ContextStrategy(heroesMongoInstance);

  return { mongoConnection, authMongoStrategy, heroesMongoStrategy };
})();
