const { celebrate, Segments, Joi } = require('celebrate');
const { Router } = require('express');
const HeroRoutesController = require('./HeroRoutesController');

const celebrateValidateGet = () => {
  return celebrate({
    [Segments.QUERY]: Joi.object({
      name: Joi.string().min(3).max(100),
      skip: Joi.number().default(0),
      limit: Joi.number().default(10),
    }),
  });
};

const celebrateValidatePost = () => {
  return celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(3).max(100).required(),
      power: Joi.string().min(3).max(100).required(),
    }),
  });
};

const celebrateValidatePatch = () => {
  return celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().guid().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(3).max(100),
      power: Joi.string().min(3).max(100),
    }),
  });
};

const celebrateValidateDelete = () => {
  return celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().guid(),
    }),
  });
};

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
