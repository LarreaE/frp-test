// app.js
import dotenv from 'dotenv';
import express from 'express';

import character from './routes/character.js'

dotenv.config();

const app = express();


app.use('/', character);

export default app;