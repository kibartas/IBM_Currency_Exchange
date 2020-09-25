import FxRateModel, {IFxRate} from '../models/fxRate';

export const findFxRates = async (cur_1: string, cur_2: string): Promise<IFxRate[]> => FxRateModel.find({"$or": [{ "ccy_to": cur_1 }, {"ccy_to": cur_2 }]});
