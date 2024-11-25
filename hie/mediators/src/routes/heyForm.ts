import logger from 'jet-logger';

import { IReq, IRes } from '@src/routes/common/types';
import HttpStatusCodes from '@src/common/HttpStatusCodes';



async function transformHeyFormData(req: IReq, res: IRes) {
  try {
    const body = req.body;
    logger.imp(JSON.stringify(body));
    res.statusCode = HttpStatusCodes.CREATED;
    res.json({ status: 'success' });
    return;
  }
  catch (error) {
    logger.err(error);
    res.statusCode = HttpStatusCodes.FORBIDDEN;
    res.json({ error: 'incorrectly formarted body', status: 'error' });
    return;
  }
}

export default { transformHeyFormData} as const;