import {Document, model, Schema} from 'mongoose';

export type ILastFetch = {
  lastFetch: Date
};

const LastFetchSchema = new Schema({
  lastFetch: Date
});

export default model<ILastFetch & Document>('lastFetch', LastFetchSchema);

