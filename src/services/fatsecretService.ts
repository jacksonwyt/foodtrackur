import { FATSECRET_CLIENT_ID, FATSECRET_CLIENT_SECRET } from '@env';
import { encode as btoa } from 'base-64'; // Need to install base-64

const TOKEN_ENDPOINT = 'https://oauth.fatsecret.com/connect/token';

interface FatSecretTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Basic caching for the access token
let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Fetches an OAuth 2.0 access token from FatSecret using client credentials.
 * Caches the token to avoid redundant requests until it's close to expiring.
 */
export async function getFatSecretAccessToken(): Promise<string> {
  const now = Date.now();
  // Refresh token if it's null or expiring within the next 60 seconds
  if (cachedToken && tokenExpiryTime && tokenExpiryTime > now + 60 * 1000) {
    console.log('Using cached FatSecret token');
    return cachedToken;
  }

  console.log('Fetching new FatSecret token...');

  if (!FATSECRET_CLIENT_ID || !FATSECRET_CLIENT_SECRET) {
    throw new Error('FatSecret API credentials are not configured in .env');
  }

  const credentials = `${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`;
  const encodedCredentials = btoa(credentials);

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: 'grant_type=client_credentials&scope=basic', // Or premiere for more features if subscribed
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('FatSecret Token Error Response:', errorBody);
      throw new Error(`Failed to fetch FatSecret token: ${response.status} ${response.statusText}`);
    }

    const data: FatSecretTokenResponse = await response.json();

    if (!data.access_token) {
        throw new Error('FatSecret token response did not contain access_token');
    }

    cachedToken = data.access_token;
    // Set expiry time slightly earlier than actual expiry for safety buffer
    tokenExpiryTime = now + (data.expires_in - 60) * 1000;
    console.log('Successfully fetched new FatSecret token.');

    return cachedToken;
  } catch (error) {
    console.error('Error fetching FatSecret access token:', error);
    // Reset cache on error
    cachedToken = null;
    tokenExpiryTime = null;
    // Re-throw the error so the caller can handle it
    throw error;
  }
}

// Interface for the structure of a food item returned by the search API
// Adjust based on the actual response structure from FatSecret v3 search
interface FatSecretFoodSearchResult {
  food_id: string;
  food_name: string;
  food_type: string; // e.g., "Generic" or "Brand"
  food_url: string;
  food_description: string; // e.g., "Per 100g - Calories: 50kcal | Fat: 0.50g | Carbs: 10.00g | Protein: 1.00g"
  // Add other relevant fields like brand_name if available
}

interface FatSecretSearchResponse {
  foods_search: {
    results: {
      food: FatSecretFoodSearchResult[] | FatSecretFoodSearchResult; // API might return single object if only one result
    };
    max_results: string; // These are returned as strings
    total_results: string;
    page_number: string;
  };
}

const API_BASE_URL = 'https://platform.fatsecret.com/rest';

/**
 * Searches for foods using the FatSecret API.
 * @param query The search term (e.g., "apple").
 * @param pageNumber The page number for pagination (defaults to 0).
 * @param maxResults The maximum number of results per page (defaults to 20).
 * @returns A promise that resolves to the parsed search results from FatSecret.
 */
export async function searchFatSecretFood(
    query: string,
    pageNumber: number = 0,
    maxResults: number = 20
): Promise<FatSecretSearchResponse> { // Return the whole response for now
  if (!query) {
    throw new Error('Search query cannot be empty.');
  }

  const token = await getFatSecretAccessToken();
  const encodedQuery = encodeURIComponent(query);
  // Using v3 search endpoint as indicated in placeholder
  const apiUrl = `${API_BASE_URL}/foods/search/v3?search_expression=${encodedQuery}&page_number=${pageNumber}&max_results=${maxResults}&format=json`;

  console.log(`Searching FatSecret: ${query}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('FatSecret Search Error Response:', errorBody);
      throw new Error(`FatSecret search request failed: ${response.status} ${response.statusText}`);
    }

    const data: FatSecretSearchResponse = await response.json();

    // --- Data Handling/Normalization --- 
    // The API might return a single object instead of an array if there's only one result.
    // Let's normalize it to always be an array for consistent handling downstream.
    if (data.foods_search && data.foods_search.results && data.foods_search.results.food) {
        if (!Array.isArray(data.foods_search.results.food)) {
            data.foods_search.results.food = [data.foods_search.results.food];
        }
    } else if (data.foods_search && data.foods_search.results) {
        // If 'food' key is missing but results exist, initialize as empty array
        data.foods_search.results.food = [];
    } else {
        // Handle cases where the structure might be unexpected (e.g., error in response structure)
        console.warn('Unexpected FatSecret search response structure:', data);
        // Ensure a default structure exists if possible, or handle as appropriate
        if (!data.foods_search) data.foods_search = { results: { food: [] }, max_results: '0', total_results: '0', page_number: '0'}; 
        else if (!data.foods_search.results) data.foods_search.results = { food: [] };
        else if (!data.foods_search.results.food) data.foods_search.results.food = [];
    }
    // --- End Data Handling --- 

    return data;
  } catch (error) {
    console.error('Error searching FatSecret food:', error);
    // Re-throw the error for the caller to handle
    throw error;
  }
}

// --- Detailed Food Info (food.get V4) ---

// Interfaces based on potential structure of food.get v4 response
// IMPORTANT: These need validation against actual API responses
interface FatSecretServingNutrition {
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  trans_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
  added_sugars?: string;
  vitamin_d?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  calcium?: string;
  iron?: string;
  // Add other potential nutrients
}

interface FatSecretServing {
  serving_id: string;
  serving_description: string; // e.g., "1 cup", "100 g"
  serving_url?: string;
  metric_serving_amount?: string;
  metric_serving_unit?: string;
  number_of_units?: string; // e.g., "1.0"
  measurement_description?: string; // e.g., "cup"
  // Include all nutrition fields directly or nested
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  trans_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
  added_sugars?: string;
  vitamin_d?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  calcium?: string;
  iron?: string;
  // Add other potential nutrients
}

interface FatSecretFoodDetails {
  food_id: string;
  food_name: string;
  food_type: string; // "Brand", "Generic", etc.
  food_url?: string;
  brand_name?: string;
  servings: {
    // Can be a single serving object or an array of servings
    serving: FatSecretServing[] | FatSecretServing;
  };
}

interface FatSecretFoodDetailsResponse {
  food: FatSecretFoodDetails;
}

/**
 * Fetches detailed nutritional information for a specific food item from FatSecret using the food.get V4 API.
 * @param foodId The unique identifier of the FatSecret food item.
 * @returns A promise that resolves to the detailed food information.
 */
export async function getFatSecretFoodDetails(foodId: string): Promise<FatSecretFoodDetailsResponse> {
  if (!foodId) {
    throw new Error('Food ID cannot be empty.');
  }

  const token = await getFatSecretAccessToken();
  const apiUrl = `${API_BASE_URL}/food/v4?food_id=${foodId}&format=json`;

  console.log(`Fetching details for FatSecret food ID: ${foodId}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('FatSecret Food Details Error Response:', errorBody);
      throw new Error(`FatSecret food details request failed: ${response.status} ${response.statusText}`);
    }

    const data: FatSecretFoodDetailsResponse = await response.json();

    // --- Data Handling/Normalization ---
    // Normalize the 'serving' field to always be an array
    if (data.food && data.food.servings && data.food.servings.serving) {
      if (!Array.isArray(data.food.servings.serving)) {
        data.food.servings.serving = [data.food.servings.serving];
      }
    } else if (data.food && data.food.servings) {
        // If serving key is missing but servings exist, initialize as empty array
        data.food.servings.serving = [];
    } else if (data.food) {
        // If servings object itself is missing, create it with empty serving array
        data.food.servings = { serving: [] };
    } else {
         console.warn('Unexpected FatSecret food details response structure:', data);
         // Handle case where 'food' might be missing
         // Depending on requirements, you might throw an error or return a default structure
         throw new Error('Invalid food details response structure received from FatSecret.');
    }
    // --- End Data Handling ---

    return data;
  } catch (error) {
    console.error(`Error fetching FatSecret food details for ID ${foodId}:`, error);
    // Re-throw the error for the caller to handle
    throw error;
  }
}

// --- TODO: Add function for getting detailed food info by ID (e.g., /food/v4) --- 