const { celebrate, Segments, Joi } = require('celebrate');

const heroRoutesValidations = () => {
  const celebrateValidateGet = () =>
    celebrate({
      [Segments.QUERY]: Joi.object({
        name: Joi.string().min(3).max(100),
        skip: Joi.number().default(0),
        limit: Joi.number().default(10),
      }),
    });

  const celebrateValidatePost = () =>
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        power: Joi.string().min(3).max(100).required(),
      }),
    });

  const celebrateValidatePatch = () =>
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().guid().required(),
      }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().min(3).max(100),
        power: Joi.string().min(3).max(100),
      }),
    });

  const celebrateValidateDelete = () =>
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().guid(),
      }),
    });

  return {
    celebrateValidateGet,
    celebrateValidatePost,
    celebrateValidatePatch,
    celebrateValidateDelete,
  };
};

module.exports = heroRoutesValidations;
