import mongoose, { Schema, Document } from 'mongoose';

export type MealTag = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface IEntry extends Document {
  userId: string;
  foodName: string;
  caloriesPer100g: number;
  weightGrams: number;
  calculatedCalories: number;
  mealTag?: MealTag;
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>(
  {
    userId: {
      type: String,
      required: [true, 'Please provide a user ID'],
      index: true,
    },
    foodName: {
      type: String,
      required: [true, 'Please provide a food name'],
      trim: true,
    },
    caloriesPer100g: {
      type: Number,
      required: [true, 'Please provide calories per 100g'],
      min: [0, 'Calories per 100g cannot be negative'],
      max: [1000, 'Calories per 100g cannot exceed 1000'],
    },
    weightGrams: {
      type: Number,
      required: [true, 'Please provide weight in grams'],
      min: [1, 'Weight must be at least 1 gram'],
      max: [10000, 'Weight cannot exceed 10000 grams'],
    },
    calculatedCalories: {
      type: Number,
      required: true,
      min: 0,
    },
    mealTag: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

export const Entry = mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema);
