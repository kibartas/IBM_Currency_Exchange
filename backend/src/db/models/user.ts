import {model, Schema, Document} from 'mongoose';

export interface IUser {
  IP: string;
  timestamp: Date;
}

const UserSchema = new Schema({
  IP: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

export default model<IUser & Document>('user', UserSchema);
