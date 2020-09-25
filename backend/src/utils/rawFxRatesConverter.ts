import {ICurrency} from '../db/models/currency';

export const rawFxRatesToCurrencies = async (rawFxRates: any): Promise<ICurrency> => {
  // "EUR" is not in any FxRates.FxRate.[].CcyAmt[1].Ccy and it's the base currency in this converter
  return { currencies: ["EUR", ...rawFxRates.FxRates.FxRate.map(
      (elem: any): string => elem.CcyAmt[1].Ccy )] };
};

