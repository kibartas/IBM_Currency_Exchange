import UsersModel, {IUser} from '../models/user';

export const insertUser = async (user: IUser): Promise<void> => {
  await new UsersModel({ IP: user.IP, timestamp: user.timestamp }).save();
}
