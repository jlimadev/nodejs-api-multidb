const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');

const defineHeroRoutes = (dbInstance) => {
  const heroRouter = Router();
  try {
    const heroRoutesController = new HeroRoutesController(dbInstance);
    heroRouter.get('/', heroRoutesController.list.bind(heroRoutesController));

    heroRouter.post(
      '/',
      heroRoutesController.create.bind(heroRoutesController),
    );

    heroRouter.patch(
      '/:id',
      heroRoutesController.update.bind(heroRoutesController),
    );

    heroRouter.delete(
      '/:id?',
      heroRoutesController.delete.bind(heroRoutesController),
    );
    return heroRouter;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = defineHeroRoutes;
