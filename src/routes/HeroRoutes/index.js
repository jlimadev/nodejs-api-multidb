const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');

const defineHeroRoutes = (dbInstance) => {
  const heroRouter = Router();
  try {
    const heroRoutesController = new HeroRoutesController(dbInstance);
    heroRouter.get('/', heroRoutesController.list.bind(heroRoutesController));
    return heroRouter;
  } catch (err) {
    console.log('INSIDE INDEX', err);
    throw Error(err);
  }
};

module.exports = defineHeroRoutes;
