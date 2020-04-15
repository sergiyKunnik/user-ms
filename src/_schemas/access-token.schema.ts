import { Schema } from 'mongoose';
import { ACCESS_TOKEN_CONSTS } from '../_consts/tokens.consts';

export const AccessTokenSchema: Schema = new Schema({
  _id: {
    required: true,
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  data: {
    type: Object,
    required: false,
  },
  validToDate: {
    type: Date,
    required: true,
    default: new Date((new Date).getTime() + ACCESS_TOKEN_CONSTS.TTL),
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  }
});
