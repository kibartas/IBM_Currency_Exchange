import {model, Schema, Document} from 'mongoose';

export interface IUser {
  IP: string;
  timestamp: Date;
  action: string;
}

const UserSchema = new Schema({
  IP: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  action: {
    type: String,
    required: true
  }
});

export default model<IUser & Document>('user', UserSchema);
