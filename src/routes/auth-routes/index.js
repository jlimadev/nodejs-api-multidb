const { Router } = require('express');

const authRoutes = (authRoutesController, authRoutesValidations) => {
  const authRouter = Router();
  const { celebrateValidateSignIn } = authRoutesValidations();

  authRouter.post(
    '/',
    celebrateValidateSignIn(),
    authRoutesController.signIn.bind(authRoutesController),
  );

  return authRouter;
};

module.exports = authRoutes;
