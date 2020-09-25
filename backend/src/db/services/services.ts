import FxRateModel, {IFxRate} from '../models/fxRate';
import CurrenciesModel, {ICurrency} from '../models/currency';

export const findFxRates = async (cur_1: string, cur_2: string): Promise<IFxRate[]> => FxRateModel.find({"$or": [{ "ccy_to": cur_1 }, {"ccy_to": cur_2 }]});

export const findAllCurrencies = async (): Promise<ICurrency | null> => CurrenciesModel.findOne({});
