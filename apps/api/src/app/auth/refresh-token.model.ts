import { Document, Schema } from 'mongoose';

export interface RefreshToken {
  _id: any;
  token: string;
  person: string;
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

RefreshTokenSchema.pre<RefreshToken & Document>('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
