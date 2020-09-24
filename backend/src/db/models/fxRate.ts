import {Document, model, Schema, Types} from 'mongoose';

export type IFxRate = {
  ccy_from: String,
  from_amt: Number,
  ccy_to: String,
  to_amt: Number
}

export const FxRate: Schema = new Schema({
  ccy_from: {
    required: true,
    type: String
  },
  from_amt: {
    required: true,
    type: Number
  },
  ccy_to: {
    required: true,
    type: String
  },
  to_amt: {
    required: true,
    type: Types.Decimal128
  }
});

export default model<IFxRate & Document>('fxRate', FxRate);
