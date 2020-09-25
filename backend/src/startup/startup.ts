import mongoose, {Document} from 'mongoose';
import {fetchCurrencyRates} from '../api';
import CurrenciesModel, {ICurrency} from '../db/models/currency';
import LastFetchModel, {ILastFetch} from '../db/models/lastFetch';
import FxRateModel, {IFxRate} from '../db/models/fxRate';
import initDB from '../db';


const getCurrencies = async (rawFxRates: any): Promise<ICurrency> => {
  // "EUR" is not in any FxRates.FxRate.[].CcyAmt[1].Ccy and it's the base currency in this converter
  return { currencies: ["EUR", ...rawFxRates.FxRates.FxRate.map(
      (elem: any): string => elem.CcyAmt[1].Ccy )] };
};

const insertCurrencies = async (currencies: string[]) => {
  const fetchedCurrencies: ICurrency | null = await CurrenciesModel.findOne({});
  if (fetchedCurrencies === null) {
    await new CurrenciesModel({ currencies: currencies }).save();
  } else {
    CurrenciesModel.updateOne({}, { currencies: currencies });
  }
};

const getFxRates = async (rawFxRates: any): Promise<IFxRate[]> => {
  return rawFxRates.FxRates.FxRate.map((elem: any): IFxRate => ({
    ccy_from: elem.CcyAmt[0].Ccy,
    from_amt: elem.CcyAmt[0].Amt,
    ccy_to: elem.CcyAmt[1].Ccy,
    to_amt: elem.CcyAmt[1].Amt
  }));
};

const initDbInformation = async (): Promise<void> => {
  let rawFxRates: any;
  try {
    rawFxRates = await fetchCurrencyRates();
  } catch {
    //TODO: real error handling
    console.error("Unable to fetch currency rates");
  }
  const currencies = await getCurrencies(rawFxRates);
  await insertCurrencies(currencies.currencies);
  await LastFetchModel.updateOne({}, { lastFetch: new Date(Date.now()) });
  //////////////////////////////////
  const FxRateModels: IFxRate[] = await getFxRates(rawFxRates);
  for (const fxrate of FxRateModels) {
    const found: IFxRate & Document | null = await FxRateModel.findOne({ ccy_to: fxrate.ccy_to });
    if (found === null) {
      await new FxRateModel(fxrate).save();
    } else {
      found.to_amt = fxrate.to_amt;
      await found.save();
    }
  }
  const EURtoEUR: IFxRate = {
    ccy_from: "EUR",
    ccy_to: "EUR",
    from_amt: 1,
    to_amt: 1
  };
  await new FxRateModel(EURtoEUR).save();
};

export const init = async (): Promise<void> => {
  try {
    await initDB();
  } catch (e) {
    console.error(e);
    console.error("Failed to connect to DB. Exiting");
    process.exit(1);
  }
  let lastFetch: ILastFetch | null = await LastFetchModel.findOne({});
  if (lastFetch === null || lastFetch.lastFetch.getDay() !== new Date().getDay()) {
    await initDbInformation();
    await new LastFetchModel({ lastFetch: Date.now() }).save();
  } else {
    console.log(lastFetch.lastFetch);
    //TODO: scheduled re-fetching
  }
};
