const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');

const defineHeroRoutes = (dbInstance) => {
  const heroRouter = Router();
  try {
    const heroRoutesController = new HeroRoutesController(dbInstance);
    heroRouter.get('/', heroRoutesController.list.bind(heroRoutesController));
    return heroRouter;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = defineHeroRoutes;
