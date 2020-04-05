import { Schema } from 'mongoose';

export interface User {
  _id: any;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  avatarUrl: String
});
