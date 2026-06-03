import mongoose, { Schema, Document } from 'mongoose';

export interface IWeightEntry extends Document {
  userId: string;
  weightKg: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeightEntrySchema = new Schema<IWeightEntry>(
  {
    userId: {
      type: String,
      required: [true, 'Please provide a user ID'],
      index: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Please provide weight in kg'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
  },
  {
    timestamps: true,
  }
);

export const WeightEntry =
  mongoose.models.WeightEntry || mongoose.model<IWeightEntry>('WeightEntry', WeightEntrySchema);
