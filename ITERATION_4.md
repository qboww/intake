# Iteration 4 - Calorie Tracking MVP + Advanced Entry Modes ✅

## Objective
Implement first usable version of daily calorie tracking functionality with support for both simple packaged foods and complex recipes.

## Part 1: Core Calorie Tracking (Initial Implementation)

### 1. Entry Form Component ✅
- **File**: `components/EntryForm.tsx`
- Features:
  - Food name input with validation
  - Calories per 100g input (0-1000 range)
  - Weight in grams input (1-10000 range)
  - Meal tag selector (breakfast, lunch, dinner, snack)
  - Real-time calorie calculation display
  - Form validation with error messages
  - Automatic form reset after successful submission
  - Loading state during submission
  - Support for create and edit modes

### 2. Daily Entry List Component ✅
- **File**: `components/DailyEntryList.tsx`
- Features:
  - Daily calorie summary card
  - Daily calorie target display
  - Remaining calories calculation
  - Progress bar with percentage
  - Color-coded progress (blue for under, orange for over)
  - Entries grouped by meal tag
  - Meal-specific color badges
  - Edit and delete buttons for each entry
  - Deletion confirmation prompt
  - Empty state message

### 3. Add Entry Page ✅
- **File**: `app/entry/new/page.tsx`
- Features:
  - Full-page form layout
  - Error state display
  - API integration for creating entries
  - Redirect to home on successful creation
  - Automatic page refresh

### 4. Edit Entry Page ✅
- **File**: `app/entry/[id]/edit/page.tsx`
- Features:
  - Dynamic route with entry ID parameter
  - Fetches existing entry data
  - Pre-populates form with current values
  - Saves changes via PUT request
  - Error handling for not found entries
  - Back navigation option

### 5. Home Page Dashboard ✅
- **File**: `app/page.tsx`
- Features:
  - Display today's date in readable format
  - Fetch today's entries from API
  - Fetch user's daily calorie target from profile
  - Display daily entry list component
  - Floating action button for adding entries
  - Loading state handling
  - Authentication check (redirect unauthenticated users to login)
  - Error state handling
  - Pull user profile data from `/api/users/me`

## Part 2: Advanced Entry Modes Enhancement

### New Database Schema ✅
- **File**: `lib/models/Entry.ts`
- Changes:
  - Added `mode` field ('simple' | 'recipe')
  - Created `Ingredient` interface for recipe mode
  - Conditional field validation based on mode
  - Backward compatible with existing simple entries
  - Support for manual calorie overrides

### Updated Entry Service ✅
- **File**: `lib/services/EntryService.ts`
- New Methods:
  - `calculateSimpleCalories()` - For simple mode calculation
  - `calculateRecipeCalories()` - For recipe mode with ingredient summation
  - `calculateCalories()` - Dispatcher based on entry mode
  - Updated `createEntry()` - Handles both modes
  - Updated `updateEntry()` - Recalculates calories for both modes
  - Updated `getRecentFoods()` - Returns both food and recipe names

### Two Entry Modes

#### Simple Mode
- **Use case**: Packaged food, known nutrition data
- **Fields**:
  - foodName: Name of the food
  - caloriesPer100g: Caloric density
  - weightGrams: Weight of portion
- **Calculation**: (caloriesPer100g × weightGrams) / 100

#### Recipe Mode
- **Use case**: Home-cooked meals, restaurant dishes, complex foods
- **Fields**:
  - recipeName: Name of the recipe/meal
  - ingredients: Array of ingredient objects
    - name: Ingredient name
    - caloriesPer100g: Optional caloric density
    - weight: Weight in grams
    - manualCalories: Optional manual calorie input
  - manualTotalCalories: Optional total override
- **Calculation**: 
  - If manualTotalCalories provided: use it directly
  - Otherwise: sum of (caloriesPer100g × weight) / 100 for each ingredient
  - Ingredients with manualCalories use that value instead

### Enhanced Entry Form ✅
- **File**: `components/EntryForm.tsx`
- Features:
  - **Mode Toggle**: Simple/Recipe button selector
  - **Simple Mode**:
    - Unchanged from original implementation
    - Fast entry for known foods
  - **Recipe Mode**:
    - Recipe name input
    - Dynamic ingredient list (add/remove)
    - Per-ingredient calorie inputs (optional)
    - Manual calorie per ingredient (for unknowns)
    - Total calorie override (for restaurants)
    - Real-time total calculation
  - **Shared**:
    - Meal tag selector
    - Real-time total calories display
    - Comprehensive validation
    - Mobile-optimized layout

### Updated Entry List Display ✅
- **File**: `components/DailyEntryList.tsx`
- Displays appropriate information based on entry mode:
  - **Simple entries**: Shows food name, weight × calories/100g
  - **Recipe entries**: Shows recipe name, ingredient count, manual override indicator
  - Seamless display for both types

### Fallback Support for Unknown Nutrition Data
1. **Per-ingredient manual calories**: Enter known calories for individual ingredients
2. **Total recipe override**: Set estimated total calories for entire recipe
3. **Optional nutrition data**: Any ingredient can have caloriesPer100g or manualCalories

## Key Features Implemented

### Iteration 4 MVP Features
✅ Fast entry creation with minimal clicks
✅ Real-time calorie calculation
✅ Form validation with helpful error messages
✅ Daily summary with progress tracking
✅ Edit existing entries
✅ Delete entries with confirmation
✅ Meal tag categorization
✅ Responsive design for mobile
✅ Dark mode support
✅ Session-based authentication
✅ Error handling and user feedback

### Advanced Features (Multi-Mode Enhancement)
✅ Two entry modes (Simple & Recipe)
✅ Multi-ingredient recipe support
✅ Flexible calorie data handling (calculated or manual)
✅ Unknown nutrition data fallback
✅ Restaurant/complex meal support
✅ Backward compatibility with existing entries
✅ Dynamic ingredient list management
✅ Real-time recipe total calculation
✅ Manual override for entire entries

## Technical Implementation

### Frontend
- **Client-side form handling**: React hooks for state management
- **Dual mode toggle**: Conditional rendering based on mode
- **Dynamic list management**: Add/remove ingredients efficiently
- **Real-time calculations**: Instant feedback on calorie totals
- **Validation**: Mode-specific validation rules
- **Navigation**: Next.js useRouter for client-side navigation

### Backend
- **Database schema**: Flexible Entry model supporting both modes
- **Service layer**: Intelligent calorie calculation based on mode
- **API routes**: Unified endpoints handling both modes
- **Data consistency**: Automatic calculation on create/update

### Data Flow
1. **Simple entry**: foodName + caloriesPer100g + weightGrams → API
2. **Recipe entry**: recipeName + ingredients[] + optional override → API
3. **Service layer**: Calculates total calories based on mode
4. **Database**: Stores complete entry with calculated calories
5. **UI Display**: Shows appropriate details based on entry type

## Backward Compatibility

- ✅ Existing simple entries continue to work unchanged
- ✅ Default mode is 'simple' for new entries
- ✅ Old data automatically works with new schema
- ✅ No migration required

## Testing Guide

### Simple Mode Testing
1. Log in with whitelisted account
2. Navigate to `/entry/new`
3. Toggle stays on "Simple"
4. Fill: Chicken Breast, 165 cal/100g, 150g
5. Select meal tag (optional)
6. Submit - should show ~248 calories

### Recipe Mode Testing
1. Navigate to `/entry/new`
2. Click "Recipe" toggle
3. Enter recipe name: "Pasta Carbonara"
4. Add first ingredient: Pasta, 150g, 130 cal/100g
5. Click "+ Add" button
6. Add second ingredient: Eggs, 2 (approx 100g), 155 cal/100g
7. Click "+ Add" button
8. Add third ingredient: Bacon, 50g (unknown nutrition - use manual 100 calories)
9. Observe total calculation updates: ~495 calories
10. Submit - verify entry shows recipe name and ingredient count
11. Edit entry - verify data pre-populates correctly
12. Delete entry - verify confirmation

### Fallback Scenario Testing
1. Create recipe entry
2. Leave caloriesPer100g blank for one ingredient
3. Enter manualCalories instead
4. Verify calculation uses manual value
5. Alternatively, set total manualTotalCalories override
6. Verify entire recipe uses override value

### Display Testing
1. Add simple entry: "Apple, 52 cal/100g, 100g"
2. Add recipe entry: "Sandwich, 3 ingredients"
3. View home page
4. Verify both entries display with appropriate details
5. Verify meal tags work for both types
6. Verify daily totals include both types

## Files Modified/Created

**New Components**:
- `components/EntryForm.tsx` - Enhanced with dual mode support
- `components/DailyEntryList.tsx` - Updated for both display types

**Updated Models**:
- `lib/models/Entry.ts` - Added mode and recipe support

**Updated Services**:
- `lib/services/EntryService.ts` - Enhanced calculation logic

**Updated Pages**:
- `app/page.tsx` - Home dashboard
- `app/entry/new/page.tsx` - Add entry
- `app/entry/[id]/edit/page.tsx` - Edit entry

## Deliverable

✅ Daily calorie tracking with flexible entry modes:
- Simple mode for packaged foods with known nutrition
- Recipe mode for complex meals and restaurants
- Fallback support for unknown nutrition data
- Full CRUD operations
- Real-time calculations
- Mobile-optimized UI
- Backward compatible with existing data

