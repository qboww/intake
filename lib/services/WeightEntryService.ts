import { dbConnect } from '../db';
import { WeightEntry, IWeightEntry } from '../models/WeightEntry';

export class WeightEntryService {
  /**
   * Create a new weight entry
   */
  static async createWeightEntry(data: Partial<IWeightEntry>): Promise<IWeightEntry> {
    await dbConnect();
    const entry = new WeightEntry(data);
    return entry.save();
  }

  /**
   * Get weight entry by ID
   */
  static async getWeightEntryById(id: string): Promise<IWeightEntry | null> {
    await dbConnect();
    return WeightEntry.findById(id);
  }

  /**
   * Get all weight entries for a user
   */
  static async getWeightEntriesByUser(userId: string): Promise<IWeightEntry[]> {
    await dbConnect();
    return WeightEntry.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get weight entries for a user within a date range
   */
  static async getWeightEntriesByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IWeightEntry[]> {
    await dbConnect();
    return WeightEntry.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: 1 }); // Ascending for trend analysis
  }

  /**
   * Get latest weight entry for a user
   */
  static async getLatestWeightEntry(userId: string): Promise<IWeightEntry | null> {
    await dbConnect();
    return WeightEntry.findOne({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Update weight entry
   */
  static async updateWeightEntry(id: string, data: Partial<IWeightEntry>): Promise<IWeightEntry | null> {
    await dbConnect();
    return WeightEntry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Delete weight entry
   */
  static async deleteWeightEntry(id: string): Promise<IWeightEntry | null> {
    await dbConnect();
    return WeightEntry.findByIdAndDelete(id);
  }

  /**
   * Calculate weight trend (current weight - weight from N days ago)
   */
  static async calculateWeightTrend(userId: string, daysAgo: number = 7): Promise<number | null> {
    await dbConnect();
    
    const latestEntry = await this.getLatestWeightEntry(userId);
    if (!latestEntry) return null;
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
    
    const olderEntry = await WeightEntry.findOne({
      userId,
      createdAt: { $lte: dateThreshold },
    }).sort({ createdAt: -1 });
    
    if (!olderEntry) return null;
    
    return latestEntry.weightKg - olderEntry.weightKg;
  }

  /**
   * Get average weight for a date range
   */
  static async getAverageWeight(userId: string, startDate: Date, endDate: Date): Promise<number | null> {
    await dbConnect();
    const entries = await this.getWeightEntriesByUserAndDateRange(userId, startDate, endDate);
    
    if (entries.length === 0) return null;
    
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weightKg, 0);
    return totalWeight / entries.length;
  }
}
