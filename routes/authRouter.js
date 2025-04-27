import '../helpers/validateBody.js';

import express from 'express';

import authControllers from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import { userAuthSchema, userResendVerification } from '../schemas/usersSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post("/register", validateBody(userAuthSchema), authControllers.register);
authRouter.post("/login", validateBody(userAuthSchema), authControllers.login);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.current);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);
authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);
authRouter.post("/verify", validateBody(userResendVerification), authControllers.resendVerifyEmail);

export default authRouter;
