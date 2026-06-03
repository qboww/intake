import { dbConnect } from '../db';
import { Entry, IEntry } from '../models/Entry';

export class EntryService {
  /**
   * Create a new entry
   */
  static async createEntry(data: Partial<IEntry>): Promise<IEntry> {
    await dbConnect();
    
    // Calculate calories if not provided
    if (!data.calculatedCalories && data.caloriesPer100g && data.weightGrams) {
      data.calculatedCalories = (data.caloriesPer100g * data.weightGrams) / 100;
    }
    
    const entry = new Entry(data);
    return entry.save();
  }

  /**
   * Get entry by ID
   */
  static async getEntryById(id: string): Promise<IEntry | null> {
    await dbConnect();
    return Entry.findById(id);
  }

  /**
   * Get all entries for a user
   */
  static async getEntriesByUser(userId: string): Promise<IEntry[]> {
    await dbConnect();
    return Entry.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get entries for a user on a specific date
   */
  static async getEntriesByUserAndDate(userId: string, date: Date): Promise<IEntry[]> {
    await dbConnect();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return Entry.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });
  }

  /**
   * Get entries for a user within a date range
   */
  static async getEntriesByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IEntry[]> {
    await dbConnect();
    return Entry.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });
  }

  /**
   * Update entry
   */
  static async updateEntry(id: string, data: Partial<IEntry>): Promise<IEntry | null> {
    await dbConnect();
    
    // Recalculate calories if needed
    if (data.caloriesPer100g || data.weightGrams) {
      const current = await Entry.findById(id);
      if (current) {
        const cal100 = data.caloriesPer100g || current.caloriesPer100g;
        const weight = data.weightGrams || current.weightGrams;
        data.calculatedCalories = (cal100 * weight) / 100;
      }
    }
    
    return Entry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Delete entry
   */
  static async deleteEntry(id: string): Promise<IEntry | null> {
    await dbConnect();
    return Entry.findByIdAndDelete(id);
  }

  /**
   * Get daily total calories for a user
   */
  static async getDailyCalories(userId: string, date: Date): Promise<number> {
    await dbConnect();
    const entries = await this.getEntriesByUserAndDate(userId, date);
    return entries.reduce((total, entry) => total + entry.calculatedCalories, 0);
  }

  /**
   * Get recent foods for a user (unique food names from last 30 days)
   */
  static async getRecentFoods(userId: string, limit: number = 10): Promise<string[]> {
    await dbConnect();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const entries = await Entry.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .select('foodName')
      .sort({ createdAt: -1 })
      .limit(limit * 2); // Get more to account for duplicates
    
    // Return unique food names
    const uniqueFoods = Array.from(new Set(entries.map((e) => e.foodName)));
    return uniqueFoods.slice(0, limit);
  }
}
