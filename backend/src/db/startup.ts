import mongoose, {Document} from "mongoose";
import {fetchCurrencyRates} from '../api/api';
import {rawFxRatesToCurrencies, rawFxRatesToFxRates} from '../utils/rawFxRatesConverter';
import {insertCurrencies} from './services/currencies';
import LastFetchModel from './models/lastFetch';
import FxRatesModel, {IFxRate} from './models/fxRate';

// initDB
export const initDB = async (): Promise<void> => {
  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/currencies', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      break;
    } catch {
      console.error("Failed to connect to DB. Retrying");
      setTimeout(() => {}, 10000);
    }
  }
};

// initDB information
export const initDBInformation = async (): Promise<void> => {
  // fetch fxRates from api
  let rawFxRates: any;
  try {
    rawFxRates = await fetchCurrencyRates();
  } catch {
    //TODO: real error handling
    console.error("Unable to fetch currency rates");
  }
  //

  // extract and insert currencies and lastFetch
  const currencies = await rawFxRatesToCurrencies(rawFxRates);
  await insertCurrencies(currencies.currencies);
  //

  // extract and insert fxRates
  const FxRateModels: IFxRate[] = await rawFxRatesToFxRates(rawFxRates);
  for (const fxrate of FxRateModels) {
    const found: IFxRate & Document | null = await FxRatesModel.findOne({ ccy_to: fxrate.ccy_to });
    if (found === null) {
      await new FxRatesModel(fxrate).save();
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
  await new FxRatesModel(EURtoEUR).save();
  //

  // update lastFetch as database has been updated
  await LastFetchModel.updateOne({}, { lastFetch: new Date(Date.now()) });
  //
};
