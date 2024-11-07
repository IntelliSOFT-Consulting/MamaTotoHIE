import express, { Request, response, Response } from 'express';
import { createClient, getOpenHIMToken, installChannels } from '../lib/utils';
import { getKeycloakAdminToken, getKeycloakUserToken } from '../lib/keycloak';


const router = express.Router();
router.use(express.json());

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
//         res.statusCode = 401;
//         res.json({ error: "incorrect email or password" });
//         return;
//     }
// });

// Login
router.post('/token', async (req: Request, res: Response) => {
  try {
        
    const { username, password } = req.body;
    // let response = await getKeycloakUserToken(username, password);
    const response = await getKeycloakAdminToken();
    // console.log(response);
    res.statusCode = !Object.keys(response).includes('error') ? 200 : 401 ;
    res.json({ ...response, status: !Object.keys(response).includes('error')  ? 'success' : 'error'   });
    return;
  }
  catch (error) {
    console.log(error);
    res.statusCode = 401;
    res.json({ error: 'incorrect email or password', status: 'error' });
    return;
  }
});



// Login
router.post('/client', async (req: Request, res: Response) => {
  try {
    await getOpenHIMToken();
    const { name, password } = req.body;
    const response = await createClient(name, password);
    if (response === 'Unauthorized' || response.includes('error')) {
      res.statusCode = 401;
      res.json({ status: 'error', error: response });
      return;
    }
    res.statusCode = 201;
    res.json({ status: 'success', response });
    return;
  }
  catch (error) {
    console.log(error);
    res.statusCode = 401;
    res.json({ error: 'incorrect email or password', status: 'error' });
    return;
  }
});

export default router;