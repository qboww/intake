import { dbConnect } from '../db';
import { User, IUser } from '../models/User';

export class UserService {
  /**
   * Get or create a user by email
   */
  static async upsertByEmail(
    email: string,
    data: Partial<IUser>
  ): Promise<IUser> {
    await dbConnect();
    
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      data,
      { upsert: true, new: true, runValidators: true }
    );
    
    return user;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<IUser | null> {
    await dbConnect();
    return User.findById(id);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    await dbConnect();
    return User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await dbConnect();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Update daily calorie target
   */
  static async updateCalorieTarget(id: string, target: number): Promise<IUser | null> {
    return this.updateUser(id, { dailyCalorieTarget: target });
  }
}
