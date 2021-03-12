const { celebrate, Segments, Joi } = require('celebrate');
const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');

const defineHeroRoutes = (dbInstance) => {
  const heroRouter = Router();
  try {
    const heroRoutesController = new HeroRoutesController(dbInstance);
    const celebrateValidateGet = () => {
      return celebrate({
        [Segments.QUERY]: Joi.object({
          name: Joi.string().min(3).max(3),
          skip: Joi.number().default(0),
          limit: Joi.number().default(10),
        }),
      });
    };

    heroRouter.get(
      '/',
      celebrateValidateGet(),
      heroRoutesController.list.bind(heroRoutesController),
    );

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
