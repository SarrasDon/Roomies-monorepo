import { Document, Schema } from 'mongoose';

export interface User extends Document {
  _id: String;
  name: String;
  email: String;
  password: String;
  avatarUrl: String;
}

export const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  avatarUrl: String
});
