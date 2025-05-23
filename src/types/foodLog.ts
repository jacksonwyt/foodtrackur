export interface FoodLog {
  id: number; // Or string (UUID) depending on your table primary key
  user_id: string; // Foreign key referencing auth.users.id
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string; // e.g., 'g', 'oz', 'cup', 'item'
  log_date: string; // ISO 8601 timestamp string (e.g., YYYY-MM-DDTHH:mm:ssZ)
  created_at?: string; // Supabase automatically handles this
}

// Type for data needed when *adding* a new food log (omits id, user_id, created_at)
export type AddFoodLogData = Omit<FoodLog, 'id' | 'user_id' | 'created_at'>;

// Type for data needed when *updating* a food log (all fields optional)
export type UpdateFoodLogData = Partial<
  Omit<FoodLog, 'id' | 'user_id' | 'created_at' | 'log_date'>
>;
