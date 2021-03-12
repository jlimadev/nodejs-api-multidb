const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');
const heroRoutesValidations = require('../../utils/celebrate-validations/heroRoutesValidations');

const {
  celebrateValidateGet,
  celebrateValidatePost,
  celebrateValidatePatch,
  celebrateValidateDelete,
} = heroRoutesValidations();

const defineHeroRoutes = (dbInstance) => {
  const heroRouter = Router();
  try {
    const heroRoutesController = new HeroRoutesController(dbInstance);

    heroRouter.get(
      '/',
      celebrateValidateGet(),
      heroRoutesController.list.bind(heroRoutesController),
    );

    heroRouter.post(
      '/',
      celebrateValidatePost(),
      heroRoutesController.create.bind(heroRoutesController),
    );

    heroRouter.patch(
      '/:id',
      celebrateValidatePatch(),
      heroRoutesController.update.bind(heroRoutesController),
    );

    heroRouter.delete(
      '/:id?',
      celebrateValidateDelete(),
      heroRoutesController.delete.bind(heroRoutesController),
    );
    return heroRouter;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = defineHeroRoutes;
