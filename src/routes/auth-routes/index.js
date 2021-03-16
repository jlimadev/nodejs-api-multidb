const { Router } = require("express");

const authRoutes = (authRoutesController, authRoutesValidations) => {
  const authRouter = Router();
  const {
    celebrateValidateSignIn,
    celebrateValidateSignUp,
  } = authRoutesValidations();

  authRouter.post(
    "/signin",
    celebrateValidateSignIn(),
    authRoutesController.signIn.bind(authRoutesController)
  );

  authRouter.post(
    "/signup",
    celebrateValidateSignUp(),
    authRoutesController.signUp.bind(authRoutesController)
  );

  authRouter.post(
    "/signout",
    authRoutesController.signOut.bind(authRoutesController)
  );

  return authRouter;
};

module.exports = authRoutes;
