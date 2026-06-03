# Calorie Tracker - Iteration 3: Database & Core Models

## Overview

Iteration 3 establishes the database layer with MongoDB and implements core data models for users, calorie entries, and weight tracking.

## ✅ Completed Features

### 1. MongoDB Connection
- [x] Installed mongoose for MongoDB connection management
- [x] Created connection caching system for hot reloads
- [x] Environment variable validation
- [x] Connection pooling support

### 2. User Model
- [x] User document with name, email, and profile image
- [x] Daily calorie target (default: 2000)
- [x] Unique email constraint with validation
- [x] Timestamps (createdAt, updatedAt)
- [x] Email format validation

### 3. Entry Model
- [x] Calorie entry with food name and nutritional data
- [x] Calories per 100g and weight in grams
- [x] Automatic calculated calories (caloriesPer100g × weightGrams ÷ 100)
- [x] Optional meal tags (breakfast, lunch, dinner, snack)
- [x] User ID reference for data isolation
- [x] Timestamps for tracking when entries were created/modified

### 4. WeightEntry Model
- [x] Weight tracking with weight in kg
- [x] User ID reference
- [x] Timestamps for historical tracking
- [x] Validation (20-500 kg range)

### 5. Service Layer
- [x] UserService for user operations
  - upsertByEmail: Create or update user
  - getUserById, getUserByEmail
  - updateUser, updateCalorieTarget
  
- [x] EntryService for calorie tracking
  - createEntry, getEntryById, updateEntry, deleteEntry
  - getEntriesByUser, getEntriesByUserAndDate, getEntriesByUserAndDateRange
  - getDailyCalories: Calculate total calories for a day
  - getRecentFoods: Get unique foods from last 30 days

- [x] WeightEntryService for weight tracking
  - createWeightEntry, getWeightEntryById, updateWeightEntry, deleteWeightEntry
  - getWeightEntriesByUser, getWeightEntriesByUserAndDateRange
  - getLatestWeightEntry: Most recent weight entry
  - calculateWeightTrend: Weight change over N days
  - getAverageWeight: Average weight for a date range

### 6. API Routes
- [x] `GET/PUT /api/users/me` - User profile management
- [x] `GET/POST /api/entries` - Calorie entries (list and create)
- [x] `GET/PUT/DELETE /api/entries/[id]` - Entry CRUD
- [x] `GET/POST /api/weight-entries` - Weight entries (list and create)
- [x] `GET/PUT/DELETE /api/weight-entries/[id]` - Weight entry CRUD
- [x] All routes protected with authentication
- [x] User isolation: each user can only access their own data

### 7. Auth Integration
- [x] Automatic user creation on first Google OAuth sign-in
- [x] User data synced with auth profile (name, email, image)
- [x] JWT callback for user persistence

## 📂 Project Structure

```
lib/
├── db.ts                      # MongoDB connection with caching
├── models/
│   ├── User.ts               # User model (name, email, calorieTarget)
│   ├── Entry.ts              # Calorie entry model
│   └── WeightEntry.ts        # Weight tracking model
└── services/
    ├── UserService.ts        # User CRUD operations
    ├── EntryService.ts       # Entry CRUD and analytics
    └── WeightEntryService.ts # Weight entry CRUD and trends

app/
├── api/
│   ├── users/
│   │   └── me/route.ts       # User profile endpoints
│   ├── entries/
│   │   ├── route.ts          # List/create entries
│   │   └── [id]/route.ts     # Get/update/delete entry
│   └── weight-entries/
│       ├── route.ts          # List/create weight entries
│       └── [id]/route.ts     # Get/update/delete weight entry
```

## 🔧 Database Setup

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

### Local Development

For local MongoDB (optional):
```
MONGODB_URI=mongodb://localhost:27017/calorie-tracker
```

## 📊 Data Models

### User
```typescript
{
  _id: ObjectId
  name: string              // User's full name
  email: string             // Unique email address
  image?: string            // Profile image URL (from Google)
  dailyCalorieTarget: number // Default 2000 calories
  createdAt: Date
  updatedAt: Date
}
```

### Entry
```typescript
{
  _id: ObjectId
  userId: string            // Reference to user email
  foodName: string          // e.g., "Apple"
  caloriesPer100g: number   // e.g., 52
  weightGrams: number       // e.g., 150
  calculatedCalories: number // Automatically calculated: (52 * 150) / 100 = 78
  mealTag?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  createdAt: Date           // When entry was logged
  updatedAt: Date
}
```

### WeightEntry
```typescript
{
  _id: ObjectId
  userId: string            // Reference to user email
  weightKg: number          // User's weight in kg
  createdAt: Date           // When weight was measured
  updatedAt: Date
}
```

## 🔌 API Examples

### Get User Profile
```bash
GET /api/users/me
Authorization: Bearer [session-token]

Response:
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "dailyCalorieTarget": 2000,
    "createdAt": "2026-06-03T...",
    "updatedAt": "2026-06-03T..."
  }
}
```

### Create Calorie Entry
```bash
POST /api/entries
Content-Type: application/json
Authorization: Bearer [session-token]

Request:
{
  "foodName": "Apple",
  "caloriesPer100g": 52,
  "weightGrams": 150,
  "mealTag": "snack"
}

Response:
{
  "entry": {
    "_id": "...",
    "userId": "user@example.com",
    "foodName": "Apple",
    "caloriesPer100g": 52,
    "weightGrams": 150,
    "calculatedCalories": 78,
    "mealTag": "snack",
    "createdAt": "2026-06-03T...",
    "updatedAt": "2026-06-03T..."
  }
}
```

### Get Daily Entries
```bash
GET /api/entries?date=2026-06-03
Authorization: Bearer [session-token]

Response:
{
  "entries": [
    { /* entry 1 */ },
    { /* entry 2 */ },
    ...
  ]
}
```

### Log Weight
```bash
POST /api/weight-entries
Content-Type: application/json
Authorization: Bearer [session-token]

Request:
{
  "weightKg": 75.5
}

Response:
{
  "entry": {
    "_id": "...",
    "userId": "user@example.com",
    "weightKg": 75.5,
    "createdAt": "2026-06-03T..."
  }
}
```

## 🛡️ Security Features

### Data Isolation
- Users can only access their own data
- Email used as userId for security
- Server-side permission checks on all endpoints

### Validation
- Email format validation
- Calorie ranges (0-1000 per 100g)
- Weight ranges (20-500 kg)
- Food name trimming and validation

### Authentication
- All API routes require valid JWT session
- Session created automatically on Google OAuth sign-in

## 🧪 Testing the Database

### Test User Creation
1. Sign in with Google OAuth
2. User automatically created in MongoDB with default settings
3. Check user data: `GET /api/users/me`

### Test Entry Creation
```javascript
// Browser console
const response = await fetch('/api/entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    foodName: 'Chicken Breast',
    caloriesPer100g: 165,
    weightGrams: 200,
    mealTag: 'lunch'
  })
});
const data = await response.json();
console.log(data);
```

### Test Weight Entry
```javascript
const response = await fetch('/api/weight-entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    weightKg: 75.0
  })
});
const data = await response.json();
console.log(data);
```

## 🚀 Performance Optimizations

### Database Indexes
- Indexed on `userId` for fast user queries
- Indexed on `createdAt` for date filtering
- Indexed on email for unique constraint

### Connection Caching
- MongoDB connection cached in global scope
- Hot reload support in development
- Connection pooling enabled

### Query Optimization
- Minimal document selection with `.select()`
- Proper sorting and limiting
- Date range queries for efficient filtering

## 📝 Notes

- Calories are calculated in the service layer, not with database hooks (for compatibility)
- User emails are used as unique identifiers for security
- All timestamps are in UTC
- Weight trend calculations support custom date ranges

## 🔗 Related Services

The data layer supports these upcoming features:
- **Iteration 4**: Calorie entry forms and UI
- **Iteration 5**: Dashboard with daily summaries
- **Iteration 7**: Statistics and charts
- **Iteration 8**: Weight trend analysis

## 📚 Next Steps

### Iteration 4 - Calorie Tracking MVP
- [ ] Add entry form UI
- [ ] Calorie calculator UI
- [ ] Entry validation UI
- [ ] Daily entry list display
- [ ] Delete entry functionality
- [ ] Edit entry functionality

---

**Status**: ✅ Iteration 3 Complete - Database layer established with MongoDB and all core models ready for use!

**Build Status**: ✅ Successful - All TypeScript types checking, 13 API routes configured, ready for Iteration 4!
