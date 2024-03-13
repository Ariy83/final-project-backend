import express from "express";
import validateBody from "../decorators/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import { signupSchema, verifySchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
// import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  // upload.single("avatarURL"),
  validateBody(signupSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(verifySchema),
  authControllers.resendVerifyEmail
);

authRouter.post("/login", validateBody(signupSchema), authControllers.login);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.patch(
  "/avatars",
  authenticate,
  // upload.single("avatarURL"),
  authControllers.updateAvatar
);

export default authRouter;
