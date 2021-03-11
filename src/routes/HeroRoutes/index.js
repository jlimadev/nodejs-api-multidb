const HeroRoutesController = require('./HeroRoutesController');
const ContextStrategy = require('../../db/strategies/context/ContextStrategy');
const MongoDB = require('../../db/strategies/mongodb/mongodb');
const mongoHeroesSchema = require('../../db/strategies/mongodb/schemas/heroesSchema');

const { Router } = require('express');
const heroesRouter = Router();

try {
  const mongoConnection = MongoDB.connect();
  const mongoDBInstance = new MongoDB(mongoConnection, mongoHeroesSchema);
  const mongoStrategy = new ContextStrategy(mongoDBInstance);

  const heroRoutesController = new HeroRoutesController(mongoStrategy);

  heroesRouter.get('/', heroRoutesController.list.bind(heroRoutesController));
} catch (err) {
  throw new Error(err);
}

module.exports = heroesRouter;
