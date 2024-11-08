import { Router } from "express";

import AuthRouter from "./auth";
import Paths from '@src/common/Paths';


const apiRouter = Router();


// auth routes
const authRouter = Router();

authRouter.post(Paths.Auth.GetToken, AuthRouter.getToken);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// TODO: add route to test webhook



// Exporrt apiRouter
export default apiRouter;

