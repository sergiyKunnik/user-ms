import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IAccessToken extends Document {
  _id: string;
  user: IUser['_id'];
  data: any;
  validToDate: Date;
  created: Date;
}
