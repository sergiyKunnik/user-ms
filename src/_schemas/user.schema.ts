import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,

  email: {
    required: true,
    type: String,
  },
  passwordHash: {
    required: true,
    type: String,
  },
  socketId: {
    required: false,
    type: String,
  },
  active: {
    required: false,
    default: false,
    type: Boolean,
  },
});
