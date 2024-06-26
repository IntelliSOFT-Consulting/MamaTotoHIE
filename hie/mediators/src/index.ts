import express from "express";
import cors from 'cors'
import * as dotenv from 'dotenv'
import cron from 'node-cron';

dotenv.config() // Load environment variables

//Import routes 

import Auth from './routes/auth'
import Beneficiary from './routes/beneficiary'
import Visit from './routes/visit'
import { fetchVisits } from "./lib/payloadMapping";


const app = express();
const PORT = 3000;

app.use(cors())

app.use((req, res, next) => {
  try {
    // Starts when a new request is received by the server
    console.log(`${new Date().toUTCString()} : The Mediator has received ${req.method} request from ${req.hostname} on ${req.path}`);
    next()
  } catch (error) {
    // Starts when a new request is received by the server
    res.json(error);
    return;
  }
});

app.use('/auth', Auth)
app.use('/beneficiary', Beneficiary)
app.use('/visit', Visit)


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});




// Set up a cron job to run every three minutes
cron.schedule('*/2 * * * *', () => {
  console.log('Cron job running every two minutes');
  // Add your task logic here
  fetchVisits();
});