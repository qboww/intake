import { dbConnect } from '../db';
import { Entry, IEntry, Ingredient } from '../models/Entry';

export class EntryService {
  /**
   * Calculate calories for simple mode entry
   */
  private static calculateSimpleCalories(
    caloriesPer100g: number,
    weightGrams: number
  ): number {
    return (caloriesPer100g * weightGrams) / 100;
  }

  /**
   * Calculate calories for recipe mode entry
   */
  private static calculateRecipeCalories(
    ingredients: Ingredient[],
    manualTotalCalories?: number
  ): number {
    // If manual override is provided, use it
    if (manualTotalCalories !== undefined) {
      return manualTotalCalories;
    }

    // Calculate based on ingredients
    return ingredients.reduce((total, ingredient) => {
      if (ingredient.manualCalories !== undefined) {
        return total + ingredient.manualCalories;
      }
      if (ingredient.caloriesPer100g !== undefined) {
        return total + (ingredient.caloriesPer100g * ingredient.weight) / 100;
      }
      return total;
    }, 0);
  }

  /**
   * Calculate calories based on mode
   */
  private static calculateCalories(entry: Partial<IEntry>): number {
    if (entry.mode === 'recipe' && entry.ingredients) {
      return this.calculateRecipeCalories(entry.ingredients, entry.manualTotalCalories);
    } else if (entry.mode === 'simple' && entry.caloriesPer100g && entry.weightGrams) {
      return this.calculateSimpleCalories(entry.caloriesPer100g, entry.weightGrams);
    }
    return 0;
  }

  /**
   * Create a new entry
   */
  static async createEntry(data: Partial<IEntry>): Promise<IEntry> {
    await dbConnect();

    // Calculate calories based on mode
    if (!data.calculatedCalories) {
      data.calculatedCalories = this.calculateCalories(data);
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

    const current = await Entry.findById(id);
    if (!current) {
      return null;
    }

    // Merge current data with update data for calculation
    const mergedData = { ...current.toObject(), ...data };

    // Recalculate calories based on mode and data changes
    data.calculatedCalories = this.calculateCalories(mergedData);

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
      .select('mode foodName recipeName')
      .sort({ createdAt: -1 })
      .limit(limit * 2); // Get more to account for duplicates
    
    // Return unique food/recipe names
    const uniqueFoods = Array.from(
      new Set(entries.map((e) => (e.mode === 'simple' ? e.foodName : e.recipeName)))
    );
    return uniqueFoods.slice(0, limit);
  }

  /**
   * Get recent entries with full details for duplication
   */
  static async getRecentEntries(userId: string, limit: number = 10): Promise<IEntry[]> {
    await dbConnect();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get entries, removing duplicates by keeping only the most recent of each food
    const entries = await Entry.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(limit * 3); // Get more to account for filtering duplicates
    
    // Create a map to track which foods we've seen
    const seenFoods = new Set<string>();
    const uniqueEntries: IEntry[] = [];
    
    for (const entry of entries) {
      const foodKey = entry.mode === 'simple' ? entry.foodName : entry.recipeName;
      if (!seenFoods.has(foodKey)) {
        seenFoods.add(foodKey);
        uniqueEntries.push(entry);
        if (uniqueEntries.length >= limit) break;
      }
    }
    
    return uniqueEntries;
  }
}
