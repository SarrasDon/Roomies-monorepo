import { Document, Schema } from 'mongoose';

export interface RefreshToken extends Document {
  token: String;
  person: String;
  createdAt: Date;
}

export const RefreshTokenSchema = new Schema({
  createdAt: Date,
  person: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String
});

RefreshTokenSchema.pre<RefreshToken>('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
