import Express, { Request, Response } from 'express';
import {fetchCurrencyList, fetchCurrencyRates} from './api';
import {TP} from './types/queryParameters';
import {init} from './startup';
import dotenv from 'dotenv';

const app = Express();

dotenv.config();

app.get('/rates', async (req: Request, res: Response) => {
  res.status(200);
  const tp: TP = req.query.tp === undefined ? 'EU' : req.query.tp as TP;
  const response = await fetchCurrencyRates(tp);
  res.send(response);
});

app.get('/list', async (req: Request, res: Response) => {
  res.status(200);
  const response = await fetchCurrencyList();
  res.send(response);
})

const port = process.env.port || 8080;

app.listen(port, async () => {
  await init();
  console.log(`Listening at port ${port}`);
});
