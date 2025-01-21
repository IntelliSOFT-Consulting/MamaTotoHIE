import { createClient, getOpenHIMToken } from '../lib/utils';
import { getKeycloakAdminToken } from '../lib/keycloak';
import { IReq, IRes } from '@src/routes/common/types';
import logger from 'jet-logger';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

// // Login
// router.get("/token", async (req: Request, res: Response) => {
//     try {
//         let token = await getOpenHIMToken();
//         await installChannels()
//         res.set(token);
//         res.json({ status: "success", token });
//         return;
//     }
//     catch (error) {
//         console.log(error);
//         res.statusCode = HttpStatusCodes.UNAUTHORIZED;
//         res.json({ error: "incorrect email or password" });
//         return;
//     }
// });

// Login

async function getToken(_: IReq, res: IRes) {
  try {
    const response = await getKeycloakAdminToken();
    res.statusCode = !Object.keys(response).includes('error') ? HttpStatusCodes.OK : HttpStatusCodes.UNAUTHORIZED ;
    res.json({ ...response, status: !Object.keys(response).includes('error')  ? 'success' : 'error'   });
  }
  catch (error) {
    logger.err(error);
    res.statusCode = HttpStatusCodes.UNAUTHORIZED;
    res.json({ error: 'incorrect email or password', status: 'error' });
  }

}



// Login
const authenticateClient = async (req: IReq, res: IRes) =>  {
  try {
    await getOpenHIMToken();
    const { name, password } = req.body as { name: string; password: string };
    const response = await createClient(name, password);
    if (response === 'Unauthorized' || response.includes('error')) {
      res.statusCode = HttpStatusCodes.UNAUTHORIZED;
      res.json({ status: 'error', error: response });
      return;
    }
    res.statusCode = HttpStatusCodes.CREATED;
    res.json({ status: 'success', response });
    return;
  }
  catch (error) {
    logger.err(error);
    res.statusCode = HttpStatusCodes.UNAUTHORIZED;
    res.json({ error: 'incorrect email or password', status: 'error' });
    return;
  }
};

export default { 
  getToken,
  authenticateClient 
} as const;