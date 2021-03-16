const { Router } = require('express');
const checkAuthentication = require('../middlewares/checkAuthentication');

const defineHeroRoutes = (heroRoutesController, heroRoutesValidations) => {
  try {
    const heroRouter = Router();

    const {
      celebrateValidateGet,
      celebrateValidatePost,
      celebrateValidatePatch,
      celebrateValidateDelete,
    } = heroRoutesValidations();

    heroRouter.use(checkAuthentication);

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
