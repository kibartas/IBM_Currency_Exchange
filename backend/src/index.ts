import Express, { Request, Response } from 'express';
import {fetchCurrencyList} from './api';
import {init} from './startup';
import dotenv from 'dotenv';
import {findAllCurrencies, findFxRates} from './db/utils';
import cors from 'cors';
import {validateRequest} from './validation';
import bodyParser from 'body-parser';
import {IRequestBody} from './types/requestBody';
import {convertMoney} from './utils/currencyExchangeCalculator';
import {IFxRate} from './db/models/fxRate';
import * as path from 'path';

const app = Express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/currencies', async (req: Request, res: Response): Promise<void> => {
  const response = await findAllCurrencies();
  res.send(response);
});

app.get('/api/fxRates', async (req: Request, res: Response): Promise<void> => {
  const response = await fetchCurrencyList();
  res.send(response);
})

app.post('/api/exchange', validateRequest);

app.post('/api/exchange', async (req: Request, res: Response): Promise<void> => {
  type IResponse = {
    fromAmt: string;
    toAmt: string;
    fromCur: string;
    toCur: string;
  };
  const body: IRequestBody = req.body;
  const twoFxRates: IFxRate[] = await findFxRates(body.ccy_from, body.ccy_to);
  // find index of the fxRate that is being converted to
  const i = twoFxRates.findIndex((fxRate) => fxRate.ccy_to === body.ccy_to);
  const j = i === 0 ? 1 : 0;
  let fromAmt = body.amt.toString();
  if (fromAmt.includes('.'))
    fromAmt = fromAmt.charAt(fromAmt.length - 2) === '.' ? fromAmt + '0' : fromAmt;
  const response: IResponse = {
    fromAmt: fromAmt,
    toAmt: convertMoney(twoFxRates[j].to_amt, twoFxRates[i].to_amt, body.amt as unknown as number).toFixed(2),
    fromCur: body.ccy_from,
    toCur: body.ccy_to
  }
  res.send(response);
});

app.use(Express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  await init();
  console.log(`Listening at port ${port}`);
});
