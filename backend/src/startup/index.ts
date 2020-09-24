import mongoose, {Document} from 'mongoose';
import {fetchCurrencyRates} from '../api';
import CurrenciesModel, {ICurrencies, ICurrency} from '../db/models/currency';
import LastFetchModel, {ILastFetch} from '../db/models/lastFetch';
import FxRateModel, {IFxRate} from '../db/models/fxRate';

const initDB = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};

const getCurrencies = async (rawFxRates: any): Promise<ICurrencies> => {
  // "EUR" is not in any FxRates.FxRate.[].CcyAmt[1].Ccy and it's the base currency in this converter
  return { currencies: [{ abbreviation: "EUR" }, ...rawFxRates.FxRates.FxRate.map(
      (elem: any): ICurrency => ({ abbreviation: elem.CcyAmt[1].Ccy }))] };
};

const insertCurrencies = async (currencies: ICurrencies) => {
  const fetchedCurrencies: ICurrencies | null = await CurrenciesModel.findOne({});
  if (fetchedCurrencies === null) {
    await new CurrenciesModel({ currencies: currencies.currencies }).save();
  } else {
    CurrenciesModel.updateOne({}, currencies.currencies);
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

const initDbInformation = async (rawFxRates: any) => {
  const currencies = await getCurrencies(rawFxRates);
  await insertCurrencies(currencies);
  await LastFetchModel.updateOne({}, { lastFetch: new Date(Date.now()) });
  //////////////////////////////////
  const FxRateModels: IFxRate[] = await getFxRates(rawFxRates);
  console.log(FxRateModels);
  for (const fxrate of FxRateModels) {
    const found: IFxRate & Document | null = await FxRateModel.findOne({ ccy_to: fxrate.ccy_to });
    if (found === null) {
      await new FxRateModel(fxrate).save();
    } else {
      found.to_amt = fxrate.to_amt;
      await found.save();
    }
  }
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
  if (lastFetch === null) {
    await new LastFetchModel({ lastFetch: Date.now() }).save();
  } else if (lastFetch.lastFetch.getDay() === new Date().getDay()) {
    console.log(lastFetch.lastFetch);
  } else {
    let rawFxRates: any;
    try {
      rawFxRates = await fetchCurrencyRates();
    } catch {
      console.error("Unable to fetch currency rates");
    }
  }
};
