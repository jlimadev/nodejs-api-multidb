const { celebrate, Joi, Segments } = require('celebrate');

const authRoutesValidations = () => {
  celebrateValidateSignIn = () => {
    return celebrate({
      [Segments.BODY]: Joi.object({
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(3).max(25),
      }),
    });
  };
};

module.exports = authRoutesValidations;
