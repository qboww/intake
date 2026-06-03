import mongoose, { Schema, Document } from 'mongoose';

export type MealTag = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type EntryMode = 'simple' | 'recipe';

export interface Ingredient {
  name: string;
  caloriesPer100g?: number;
  weight: number;
  manualCalories?: number;
}

export interface IEntry extends Document {
  userId: string;
  mode: EntryMode;
  
  // Simple mode
  foodName?: string;
  caloriesPer100g?: number;
  weightGrams?: number;
  
  // Recipe mode
  recipeName?: string;
  ingredients?: Ingredient[];
  manualTotalCalories?: number;
  
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
    mode: {
      type: String,
      enum: ['simple', 'recipe'],
      required: [true, 'Please specify entry mode'],
      default: 'simple',
    },
    // Simple mode fields
    foodName: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.mode === 'simple';
      },
    },
    caloriesPer100g: {
      type: Number,
      required: function (this: any) {
        return this.mode === 'simple';
      },
      min: [0, 'Calories per 100g cannot be negative'],
      max: [1000, 'Calories per 100g cannot exceed 1000'],
    },
    weightGrams: {
      type: Number,
      required: function (this: any) {
        return this.mode === 'simple';
      },
      min: [1, 'Weight must be at least 1 gram'],
      max: [10000, 'Weight cannot exceed 10000 grams'],
    },
    // Recipe mode fields
    recipeName: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.mode === 'recipe';
      },
    },
    ingredients: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          caloriesPer100g: {
            type: Number,
            min: [0, 'Calories cannot be negative'],
            max: [1000, 'Calories cannot exceed 1000'],
          },
          weight: {
            type: Number,
            required: true,
            min: [1, 'Weight must be at least 1 gram'],
            max: [10000, 'Weight cannot exceed 10000 grams'],
          },
          manualCalories: {
            type: Number,
            min: [0, 'Calories cannot be negative'],
          },
        },
      ],
      required: function (this: any) {
        return this.mode === 'recipe';
      },
    },
    manualTotalCalories: {
      type: Number,
      min: [0, 'Total calories cannot be negative'],
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
