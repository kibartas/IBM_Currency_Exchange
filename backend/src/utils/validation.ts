import {NextFunction, Request, Response} from 'express';
import {IRequestBody} from '../types/requestBody';
import {findAllCurrencies} from '../db/services/currencies';

const numberValidationRegex = /^\d{1,16}(?:\.\d{1,2})?$/;

const argumentTooLarge = (res: Response) => {
  res.status(400);
  res.send({ "message": `Number too large. 
      Accept only values of length between 1 and ${Number.MAX_SAFE_INTEGER.toString().length}`});
};

export const validateRequest = async (req: Request, res: Response, next: NextFunction) => {
  const body: IRequestBody | undefined = req.body;
  if (!body || !body?.amt || !body?.ccy_from || !body?.ccy_to) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  body.ccy_from = body.ccy_from.toString();
  body.ccy_to = body.ccy_to.toString();
  body.amt = body.amt.toString();
  if (body.ccy_from.length != 3 || body.ccy_to.length != 3) {
    res.status(400);
    res.send("Invalid currencies");
    return;
  }
  if (body.ccy_from === body.ccy_to) {
    res.status(400);
    res.send("Currencies should not match");
    return;
  }
  if (!numberValidationRegex.test(body.amt)) {
    res.status(400);
    res.send("Invalid number format");
    return;
  }
  if (body.amt.includes('.')) {
    if (parseFloat(body.amt) * 100 > Number.MAX_SAFE_INTEGER) {
      argumentTooLarge(res);
    }
  } else {
    if (parseInt(body.amt) > Number.MAX_SAFE_INTEGER) {
      argumentTooLarge(res);
    }
  }

  const currencies = await findAllCurrencies();
  if (currencies === null) {
    res.status(500);
    res.send("Server malfunction. Try again later");
    return;
  }
  if (!currencies.currencies.includes(body.ccy_to) || !currencies.currencies.includes(body.ccy_from)) {
    res.status(400);
    res.send("Currencies not found");
    return;
  }
  req.body.amt = parseFloat(body.amt);
  next();
};
