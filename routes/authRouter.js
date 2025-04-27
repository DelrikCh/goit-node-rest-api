import '../helpers/validateBody.js';

import express from 'express';

import authControllers from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import { userAuthSchema } from '../schemas/usersSchemas.js';
import authenticate from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post("/register", validateBody(userAuthSchema), authControllers.register);
authRouter.post("/login", validateBody(userAuthSchema), authControllers.login);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.current);

export default authRouter;
