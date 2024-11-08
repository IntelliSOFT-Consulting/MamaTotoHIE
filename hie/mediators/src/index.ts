import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import morgan from 'morgan';
import logger from 'jet-logger';

//Import routes 
import Auth from './routes/auth';
import Beneficiary from './routes/beneficiary';
import Visit from './routes/visit';
import Callback from './routes/callback';
import Custom from './routes/custom';

import { fetchApprovedEndorsements, fetchVisits } from './lib/payloadMapping';
import EnvVars from '@src/common/EnvVars';
import { NodeEnvs } from '@src/common/misc';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import BaseRouter from '@src/routes';


const app = express();

app.use(cors());

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  try {
    // Starts when a new request is received by the server
    logger.info(`${new Date().toUTCString()} : The Mediator has received ${req.method} request from ${req.hostname} on ${req.path}`);
    next();
  } catch (error) {
    // Starts when a new request is received by the server
    res.json(error);
    return;
  }
});

app.use(BaseRouter);
app.use('/beneficiary', Beneficiary);
app.use('/visit', Visit);
app.use('/callback', Callback);
app.use('/custom', Custom);

// add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});



app.listen(EnvVars.Port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${EnvVars.Port}`);
});

// Set up a cron job to run every three minutes
cron.schedule(`*/${EnvVars.CRON_INTERVAL} * * * *`, () => {
  console.log(`Cron job running every ${EnvVars.CRON_INTERVAL} minutes`);
  fetchVisits();
  fetchApprovedEndorsements();
});

