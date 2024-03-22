import express from "express";
import validateBody from "../decorators/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import usersSchemas from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import isResetTokenValid from "../middlewares/isResetTokenValid.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersSchemas.signupSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(usersSchemas.verifySchema),
  authControllers.resendVerifyEmail
);

authRouter.post(
  "/login",
  validateBody(usersSchemas.signupSchema),
  authControllers.login
);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.patch(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  validateBody(usersSchemas.updateSchema),
  authControllers.updateUser
);

authRouter.patch(
  "/water-rate",
  authenticate,
  validateBody(usersSchemas.waterRateChangeSchema),
  authControllers.updateWaterRate
);

authRouter.post(
  "/forgot-password",
  validateBody(usersSchemas.forgotPassword),
  authControllers.forgotPassword
);

authRouter.post(
  "/reset-password/",
  isResetTokenValid,
  authControllers.resetPassword
);

authRouter.post(
  "/reset-password/:token/:id",
  isResetTokenValid,
  authControllers.resetPassword
);
export default authRouter;
