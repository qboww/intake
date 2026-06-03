import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  dailyCalorieTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    image: {
      type: String,
      default: null,
    },
    dailyCalorieTarget: {
      type: Number,
      required: [true, 'Please provide a daily calorie target'],
      default: 2000,
      min: [500, 'Daily calorie target must be at least 500'],
      max: [10000, 'Daily calorie target cannot exceed 10000'],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
