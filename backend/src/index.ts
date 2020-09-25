import Express, { Request, Response } from 'express';
import {fetchCurrencyList, fetchCurrencyRates} from './api';
import {TP} from './types/queryParameters';
import {init} from './startup';
import dotenv from 'dotenv';
import {findAllCurrencies, findFxRates} from './db/utils';
import cors from 'cors';
import {validateRequest} from './validation';
import bodyParser from 'body-parser';
import {IRequestBody} from './types/requestBody';
import {convertMoney} from './utils/currencyExchangeCalculator';
import {IFxRate} from './db/models/fxRate';

const app = Express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/currencies', async (req: Request, res: Response): Promise<void> => {
  const response = await findAllCurrencies();
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
