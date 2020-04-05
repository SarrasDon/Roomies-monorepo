import { Document, Schema } from 'mongoose';

export interface User {
  _id: any;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export interface UserDocument extends User, Document {}

export const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  avatarUrl: String
});
