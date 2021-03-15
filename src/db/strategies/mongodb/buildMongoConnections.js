const ContextStrategy = require('../context/ContextStrategy');
const MongoDB = require('./mongodb');
const mongoHeroesSchema = require('./schemas/heroesSchema');
const mongoAuthSchema = require('./schemas/authSchema');

module.exports = (() => {
  const mongoConnection = MongoDB.connect();

  const authMongoInstance = new MongoDB(mongoConnection, mongoAuthSchema);

  const heroesMongoInstance = new MongoDB(mongoConnection, mongoHeroesSchema);

  const authMongoStrategy = new ContextStrategy(authMongoInstance);
  const heroesMongoStrategy = new ContextStrategy(heroesMongoInstance);

  return { mongoConnection, authMongoStrategy, heroesMongoStrategy };
})();
