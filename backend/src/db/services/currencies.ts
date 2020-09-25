import CurrenciesModel, {ICurrency} from '../models/currency';

export const findAllCurrencies = async (): Promise<ICurrency | null> => CurrenciesModel.findOne({});


export const insertCurrencies = async (currencies: string[]) => {
  const fetchedCurrencies: ICurrency | null = await CurrenciesModel.findOne({});
  if (fetchedCurrencies === null) {
    await new CurrenciesModel({ currencies: currencies }).save();
  } else {
    CurrenciesModel.updateOne({}, { currencies: currencies });
  }
};
