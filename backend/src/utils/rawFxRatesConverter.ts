import {ICurrency} from '../db/models/currency';
import {IFxRate} from '../db/models/fxRate';

export const rawFxRatesToCurrencies = async (rawFxRates: any): Promise<ICurrency> => {
  // "EUR" is not in any FxRates.FxRate.[].CcyAmt[1].Ccy and it's the base currency in this converter
  return { currencies: ["EUR", ...rawFxRates.FxRates.FxRate.map(
      (elem: any): string => elem.CcyAmt[1].Ccy )] };
};


export const rawFxRatesToFxRates = async (rawFxRates: any): Promise<IFxRate[]> => {
  return rawFxRates.FxRates.FxRate.map((elem: any): IFxRate => ({
    ccy_from: elem.CcyAmt[0].Ccy,
    from_amt: elem.CcyAmt[0].Amt,
    ccy_to: elem.CcyAmt[1].Ccy,
    to_amt: elem.CcyAmt[1].Amt
  }));
};

