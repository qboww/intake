'use client';

import { useState, useEffect } from 'react';
import { MealTag } from '@/lib/models/Entry';

export type EntryMode = 'simple' | 'recipe';

export interface Ingredient {
  name: string;
  caloriesPer100g?: number;
  weight: number;
  manualCalories?: number;
}

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => Promise<void>;
  initialData?: EntryFormData & { id?: string };
  isLoading?: boolean;
}

export interface EntryFormData {
  mode: EntryMode;
  // Simple mode
  foodName?: string;
  caloriesPer100g?: number;
  weightGrams?: number;
  // Recipe mode
  recipeName?: string;
  ingredients?: Ingredient[];
  manualTotalCalories?: number;
  // Common
  mealTag?: MealTag;
}

const MEAL_TAGS: MealTag[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function EntryForm({
  onSubmit,
  initialData,
  isLoading = false,
}: EntryFormProps) {
  const [mode, setMode] = useState<EntryMode>(initialData?.mode || 'simple');
  const [formData, setFormData] = useState<EntryFormData>(
    initialData || {
      mode: 'simple',
      foodName: '',
      caloriesPer100g: 0,
      weightGrams: 0,
      recipeName: '',
      ingredients: [{ name: '', caloriesPer100g: 0, weight: 0 }],
      mealTag: undefined,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedCalories, setCalculatedCalories] = useState(0);

  // Update form when initialData changes (e.g., duplicating a recent food)
  useEffect(() => {
    if (initialData) {
      setMode(initialData.mode || 'simple');
      setFormData(initialData);
    }
  }, [initialData]);

  // Update calculated calories when inputs change
  useEffect(() => {
    if (mode === 'simple') {
      const calculated =
        (formData.caloriesPer100g || 0) * (formData.weightGrams || 0) / 100;
      setCalculatedCalories(Math.round(calculated * 10) / 10);
    } else if (mode === 'recipe') {
      if (formData.manualTotalCalories !== undefined && formData.manualTotalCalories > 0) {
        setCalculatedCalories(formData.manualTotalCalories);
      } else {
        const total = (formData.ingredients || []).reduce((sum, ingredient) => {
          if (ingredient.manualCalories !== undefined && ingredient.manualCalories > 0) {
            return sum + ingredient.manualCalories;
          }
          if (ingredient.caloriesPer100g && ingredient.caloriesPer100g > 0) {
            return sum + (ingredient.caloriesPer100g * ingredient.weight) / 100;
          }
          return sum;
        }, 0);
        setCalculatedCalories(Math.round(total * 10) / 10);
      }
    }
  }, [mode, formData.caloriesPer100g, formData.weightGrams, formData.ingredients, formData.manualTotalCalories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'simple') {
      if (!formData.foodName?.trim()) {
        newErrors.foodName = 'Food name is required';
      }
      if (formData.caloriesPer100g && formData.caloriesPer100g > 1000) {
        newErrors.caloriesPer100g = 'Cannot exceed 1000';
      }
      if ((formData.weightGrams || 0) < 1) {
        newErrors.weightGrams = 'Must be at least 1 gram';
      } else if ((formData.weightGrams || 0) > 10000) {
        newErrors.weightGrams = 'Cannot exceed 10000 grams';
      }
      if ((formData.caloriesPer100g || 0) <= 0 && calculatedCalories <= 0) {
        newErrors.caloriesPer100g = 'Please provide calories per 100g or set weight';
      }
    } else if (mode === 'recipe') {
      if (!formData.recipeName?.trim()) {
        newErrors.recipeName = 'Recipe name is required';
      }
      if (!formData.ingredients || formData.ingredients.length === 0) {
        newErrors.ingredients = 'At least one ingredient is required';
      } else {
        formData.ingredients.forEach((ingredient, index) => {
          if (!ingredient.name.trim()) {
            newErrors[`ingredient_${index}_name`] = 'Ingredient name is required';
          }
          if (ingredient.weight < 1 || ingredient.weight > 10000) {
            newErrors[`ingredient_${index}_weight`] = 'Weight must be 1-10000g';
          }
          if (
            !ingredient.manualCalories &&
            !ingredient.caloriesPer100g
          ) {
            newErrors[`ingredient_${index}_cal`] = 'Provide calories/100g or manual calories';
          }
          if (ingredient.caloriesPer100g && ingredient.caloriesPer100g > 1000) {
            newErrors[`ingredient_${index}_cal`] = 'Cannot exceed 1000';
          }
        });
      }
      if (calculatedCalories <= 0) {
        newErrors.totalCalories = 'Total calories must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: EntryFormData = {
        mode,
        mealTag: formData.mealTag,
      };

      if (mode === 'simple') {
        submitData.foodName = formData.foodName;
        submitData.caloriesPer100g = formData.caloriesPer100g;
        submitData.weightGrams = formData.weightGrams;
      } else {
        submitData.recipeName = formData.recipeName;
        submitData.ingredients = formData.ingredients;
        if (formData.manualTotalCalories && formData.manualTotalCalories > 0) {
          submitData.manualTotalCalories = formData.manualTotalCalories;
        }
      }

      await onSubmit(submitData);

      // Reset form on success if not editing
      if (!initialData?.id) {
        setMode('simple');
        setFormData({
          mode: 'simple',
          foodName: '',
          caloriesPer100g: 0,
          weightGrams: 0,
          recipeName: '',
          ingredients: [{ name: '', caloriesPer100g: 0, weight: 0 }],
          mealTag: undefined,
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...(formData.ingredients || []), { name: '', caloriesPer100g: 0, weight: 0 }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = (formData.ingredients || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients.length > 0 ? newIngredients : [{ name: '', caloriesPer100g: 0, weight: 0 }],
    });
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Mode toggle */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => {
            setMode('simple');
            setFormData({ ...formData, mode: 'simple' });
          }}
          className={`flex-1 py-2 px-3 rounded font-medium transition ${
            mode === 'simple'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Simple
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('recipe');
            setFormData({ ...formData, mode: 'recipe' });
          }}
          className={`flex-1 py-2 px-3 rounded font-medium transition ${
            mode === 'recipe'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Recipe
        </button>
      </div>

      {/* Simple mode form */}
      {mode === 'simple' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="foodName"
              className="block text-sm font-medium mb-1"
            >
              Food Name
            </label>
            <input
              id="foodName"
              type="text"
              value={formData.foodName || ''}
              onChange={(e) =>
                setFormData({ ...formData, foodName: e.target.value })
              }
              placeholder="e.g., Chicken Breast"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={isLoading}
            />
            {errors.foodName && (
              <p className="text-red-500 text-xs mt-1">{errors.foodName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="caloriesPer100g"
                className="block text-sm font-medium mb-1"
              >
                Calories per 100g
              </label>
              <input
                id="caloriesPer100g"
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={formData.caloriesPer100g || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    caloriesPer100g: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="165"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isLoading}
              />
              {errors.caloriesPer100g && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caloriesPer100g}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="weightGrams"
                className="block text-sm font-medium mb-1"
              >
                Weight (grams)
              </label>
              <input
                id="weightGrams"
                type="number"
                min="1"
                max="10000"
                step="1"
                value={formData.weightGrams || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weightGrams: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="150"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isLoading}
              />
              {errors.weightGrams && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.weightGrams}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recipe mode form */}
      {mode === 'recipe' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="recipeName"
              className="block text-sm font-medium mb-1"
            >
              Recipe Name
            </label>
            <input
              id="recipeName"
              type="text"
              value={formData.recipeName || ''}
              onChange={(e) =>
                setFormData({ ...formData, recipeName: e.target.value })
              }
              placeholder="e.g., Pasta Carbonara"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={isLoading}
            />
            {errors.recipeName && (
              <p className="text-red-500 text-xs mt-1">{errors.recipeName}</p>
            )}
          </div>

          {/* Ingredients list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add
              </button>
            </div>

            {(formData.ingredients || []).map((ingredient, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, 'name', e.target.value)
                    }
                    placeholder="e.g., Pasta"
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    disabled={isLoading}
                  />
                  {errors[`ingredient_${index}_name`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`ingredient_${index}_name`]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Weight (g)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={ingredient.weight}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          'weight',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="100"
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Cal/100g (opt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={ingredient.caloriesPer100g || ''}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          'caloriesPer100g',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Manual Calories (opt)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={ingredient.manualCalories || ''}
                    onChange={(e) =>
                      updateIngredient(
                        index,
                        'manualCalories',
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    placeholder="Leave empty if unknown"
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    If uncertain, provide manual calorie count for this ingredient
                  </p>
                </div>

                {(formData.ingredients?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                  >
                    Remove
                  </button>
                )}

                {errors[`ingredient_${index}_weight`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ingredient_${index}_weight`]}
                  </p>
                )}
                {errors[`ingredient_${index}_cal`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`ingredient_${index}_cal`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Manual total override */}
          <div>
            <label
              htmlFor="manualTotalCalories"
              className="block text-sm font-medium mb-1"
            >
              Override Total Calories (optional)
            </label>
            <input
              id="manualTotalCalories"
              type="number"
              min="0"
              value={formData.manualTotalCalories || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manualTotalCalories: parseFloat(e.target.value) || undefined,
                })
              }
              placeholder="Leave empty to calculate from ingredients"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use this for restaurant meals or when ingredients aren't precisely measured
            </p>
          </div>

          {errors.ingredients && (
            <p className="text-red-500 text-xs">{errors.ingredients}</p>
          )}
          {errors.totalCalories && (
            <p className="text-red-500 text-xs">{errors.totalCalories}</p>
          )}
        </div>
      )}

      {/* Meal tag - common to both modes */}
      <div>
        <label
          htmlFor="mealTag"
          className="block text-sm font-medium mb-1"
        >
          Meal (optional)
        </label>
        <select
          id="mealTag"
          value={formData.mealTag || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              mealTag: (e.target.value as MealTag) || undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          disabled={isLoading}
        >
          <option value="">Select a meal</option>
          {MEAL_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Calculated calories display */}
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">Total Calories:</span>{' '}
          {calculatedCalories.toFixed(1)} kcal
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
      >
        {isLoading
          ? 'Saving...'
          : initialData?.id
            ? 'Update Entry'
            : 'Add Entry'}
      </button>
    </form>
  );
}
