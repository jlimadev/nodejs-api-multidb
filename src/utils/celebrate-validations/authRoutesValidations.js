const { celebrate, Joi, Segments } = require('celebrate');

const authRoutesValidations = () => {
  celebrateValidateSignIn = () => {
    return celebrate({
      [Segments.BODY]: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    });
  };

  return { celebrateValidateSignIn };
};

module.exports = authRoutesValidations;
