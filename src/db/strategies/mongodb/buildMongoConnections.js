const ContextStrategy = require('../context/ContextStrategy');
const MongoDB = require('./mongodb');
const mongoHeroesSchema = require('./schemas/heroesSchema');

module.exports = (() => {
  const heroesMongoConnection = MongoDB.connect();

  const heroesMongoInstance = new MongoDB(
    heroesMongoConnection,
    mongoHeroesSchema,
  );

  const heroesMongoStrategy = new ContextStrategy(heroesMongoInstance);

  return { heroesMongoConnection, heroesMongoStrategy };
})();
