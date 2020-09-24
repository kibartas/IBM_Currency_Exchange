import {Document, model, Schema} from 'mongoose';

export type ILastFetch = {
  lastFetch: Date
};

export const lastFetch = new Schema({
  lastFetch: Date
});

export default model<ILastFetch & Document>('lastFetch', lastFetch);

