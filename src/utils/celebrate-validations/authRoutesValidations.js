const { celebrate, Joi, Segments } = require("celebrate");

const authRoutesValidations = () => {
  const celebrateValidateSignIn = () =>
    celebrate({
      [Segments.BODY]: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    });

  const celebrateValidateSignUp = () =>
    celebrate({
      [Segments.BODY]: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        passwordConfirmation: Joi.string()
          .valid(Joi.ref("password"))
          .required(),
      }),
    });

  return { celebrateValidateSignIn, celebrateValidateSignUp };
};

module.exports = authRoutesValidations;
