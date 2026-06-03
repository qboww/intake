import { dbConnect } from '../db';
import { WeightEntry, IWeightEntry } from '../models/WeightEntry';

export interface WeightChartPoint {
  date: string; // YYYY-MM-DD
  weight: number;
}

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

  /**
   * Get weight data for 30 days (one entry per day, latest if multiple)
   */
  static async get30DayWeightData(userId: string): Promise<WeightChartPoint[]> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29); // 30 days total
    startDate.setHours(0, 0, 0, 0);

    const entries = await this.getWeightEntriesByUserAndDateRange(userId, startDate, endDate);

    // Group by date and take the latest entry for each day
    const dailyMap = new Map<string, IWeightEntry>();

    entries.forEach((entry) => {
      const dateStr = entry.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(dateStr);
      // Keep the later entry (entries are sorted ascending)
      if (!existing || entry.createdAt > existing.createdAt) {
        dailyMap.set(dateStr, entry);
      }
    });

    // Build chart data for all 30 days, filling missing with previous value
    const data: WeightChartPoint[] = [];
    let lastWeight = 0;

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const entry = dailyMap.get(dateStr);
      if (entry) {
        lastWeight = entry.weightKg;
      }

      if (lastWeight > 0) {
        data.push({
          date: dateStr,
          weight: lastWeight,
        });
      }
    }

    return data;
  }

  /**
   * Calculate weight change over 30 days
   */
  static async getWeightChange30Day(userId: string): Promise<number> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    // Get first and last entries
    const firstEntry = await WeightEntry.findOne({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: 1 });

    const lastEntry = await WeightEntry.findOne({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    if (!firstEntry || !lastEntry) {
      return 0;
    }

    // Return negative if weight decreased (good), positive if increased
    return Math.round((lastEntry.weightKg - firstEntry.weightKg) * 10) / 10;
  }

  /**
   * Get weight summary
   */
  static async getWeightSummary(userId: string) {
    const latestEntry = await this.getLatestWeightEntry(userId);
    const change30Day = await this.getWeightChange30Day(userId);
    const chartData = await this.get30DayWeightData(userId);

    const goalWeight = 75; // Default goal weight

    return {
      currentWeight: latestEntry?.weightKg || 0,
      goalWeight,
      weightChange30Day: change30Day,
      lastUpdated: latestEntry?.createdAt || null,
      entryCount: chartData.length,
    };
  }
}
