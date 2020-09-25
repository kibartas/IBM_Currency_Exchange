import {model, Schema, Document} from 'mongoose';

export type ICurrency = {
  currencies: string[]
};

export const Currencies: Schema = new Schema<ICurrency>({
  currencies: {
    type: [{
      type: String
    }],
    required: true
  }
});

export default model<ICurrency & Document>('currencies', Currencies);
