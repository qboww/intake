import { dbConnect } from '../db';
import { Entry, IEntry } from '../models/Entry';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  entryCount: number;
}

export interface ChartDataPoint {
  date: string;
  calories: number;
}

export class CalorieStatsService {
  /**
   * Get daily calorie totals for a date range
   */
  static async getDailyTotals(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyStat[]> {
    await dbConnect();

    // Aggregate entries by day
    const entries = await Entry.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: 1 });

    // Group by date
    const dailyMap = new Map<string, DailyStat>();

    entries.forEach((entry) => {
      const dateStr = entry.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(dateStr) || {
        date: dateStr,
        totalCalories: 0,
        entryCount: 0,
      };

      existing.totalCalories += entry.calculatedCalories;
      existing.entryCount += 1;

      dailyMap.set(dateStr, existing);
    });

    // Convert to array and sort by date
    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * Get 7-day chart data (last 7 days)
   */
  static async get7DayData(userId: string): Promise<ChartDataPoint[]> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6); // Include today + 6 previous days
    startDate.setHours(0, 0, 0, 0);

    const dailyTotals = await this.getDailyTotals(userId, startDate, endDate);

    // Fill in missing days with 0
    const data: ChartDataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = dailyTotals.find((d) => d.date === dateStr);
      data.push({
        date: dateStr,
        calories: existing?.totalCalories || 0,
      });
    }

    return data;
  }

  /**
   * Get 30-day chart data (last 30 days)
   */
  static async get30DayData(userId: string): Promise<ChartDataPoint[]> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29); // Include today + 29 previous days
    startDate.setHours(0, 0, 0, 0);

    const dailyTotals = await this.getDailyTotals(userId, startDate, endDate);

    // Fill in missing days with 0
    const data: ChartDataPoint[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = dailyTotals.find((d) => d.date === dateStr);
      data.push({
        date: dateStr,
        calories: existing?.totalCalories || 0,
      });
    }

    return data;
  }

  /**
   * Get 7-day average calories
   */
  static async get7DayAverage(userId: string): Promise<number> {
    const data = await this.get7DayData(userId);
    const total = data.reduce((sum, d) => sum + d.calories, 0);
    return Math.round(total / 7);
  }

  /**
   * Get 30-day average calories
   */
  static async get30DayAverage(userId: string): Promise<number> {
    const data = await this.get30DayData(userId);
    const total = data.reduce((sum, d) => sum + d.calories, 0);
    return Math.round(total / 30);
  }

  /**
   * Get current streak (consecutive days with entries)
   */
  static async getCurrentStreak(userId: string): Promise<number> {
    await dbConnect();

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const entriesOnDay = await Entry.findOne({
        userId,
        createdAt: { $gte: currentDate, $lte: endOfDay },
      });

      if (!entriesOnDay) {
        break;
      }

      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  /**
   * Get statistics summary
   */
  static async getStatsSummary(userId: string) {
    const sevenDayAvg = await this.get7DayAverage(userId);
    const thirtyDayAvg = await this.get30DayAverage(userId);
    const streak = await this.getCurrentStreak(userId);
    const sevenDayData = await this.get7DayData(userId);

    // Get today's total
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayData = sevenDayData.find(
      (d) => d.date === today.toISOString().split('T')[0]
    );
    const todayTotal = todayData?.calories || 0;

    return {
      today: todayTotal,
      sevenDayAverage: sevenDayAvg,
      thirtyDayAverage: thirtyDayAvg,
      currentStreak: streak,
    };
  }
}
