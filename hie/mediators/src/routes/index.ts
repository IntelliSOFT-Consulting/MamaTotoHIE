import { Router } from "express";

import AuthRouter from "@src/routes/auth";
import Paths from '@src/common/Paths';
import HeyFormRouter from "@src/routes/heyForm";


const apiRouter = Router();


// auth routes
const authRouter = Router();

authRouter.post(Paths.Auth.GetToken, AuthRouter.getToken);
authRouter.post(Paths.Auth.AuthenticateClient, AuthRouter.authenticateClient);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// TODO: add route to test webhook

const heyFormRouter = Router();

heyFormRouter.post(Paths.HeyForm.Webhook, HeyFormRouter.transformHeyFormData);

// Add HeyFormRouter
apiRouter.use(Paths.HeyForm.Base, heyFormRouter);



// Exporrt apiRouter
export default apiRouter;

