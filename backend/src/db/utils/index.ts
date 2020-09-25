import CurrenciesModel, {ICurrency} from '../models/currency';
import FxRateModel, {IFxRate} from '../models/fxRate';

export const findAllCurrencies = async (): Promise<ICurrency | null> => CurrenciesModel.findOne({});

export const findFxRates = async (cur_1: string, cur_2: string): Promise<IFxRate[]> => FxRateModel.find({"$or": [{ "ccy_to": cur_1 }, {"ccy_to": cur_2 }]});
