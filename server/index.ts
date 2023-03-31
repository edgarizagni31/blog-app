import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { initializeDatabase } from './config/mongoose';
import routerAuth from './api/auth/routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

initializeDatabase();

//global middlewares
app.use(bodyParser.json());

//routes
app.use(routerAuth);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
