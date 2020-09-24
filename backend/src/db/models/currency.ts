import {model, Schema, Document} from 'mongoose';

export type ICurrencies = { currencies: ICurrency[] };

export type ICurrency = { abbreviation: String };

export const Currency: Schema = new Schema<ICurrency>({
  abbreviation: {
    type: String,
    required: true
  }
});

export const Currencies: Schema = new Schema<ICurrencies>({
  currencies: {
    type: [Currency],
    required: true
  }
});

export default model<ICurrencies & Document>('currencies', Currencies);
