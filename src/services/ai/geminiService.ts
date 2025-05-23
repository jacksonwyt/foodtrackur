import {GoogleGenAI, HarmCategory, HarmBlockThreshold} from '@google/genai';
import {GEMINI_API_KEY} from '@env';
import * as FileSystem from 'expo-file-system'; // Use Expo's cross-platform file system

// --- Type Definitions ---
// For data passed to LogEntryScreen
export interface FoodLogItemData {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_unit: string;
}

// Expected structure from Gemini API for a single food item
interface GeminiFoodItem {
  food_name: string;
  serving_description: string; // e.g., "1 medium (approx 182g)", "100g", "1 cup"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Expected root structure of Gemini's JSON response
interface GeminiApiResponse {
  food_items: GeminiFoodItem[];
}

// Basic configuration - adjust model name and safety settings as needed
const MODEL_NAME = 'gemini-1.5-flash'; // For image analysis
const TEXT_MODEL_NAME = 'gemini-1.5-flash'; // For text processing
const API_KEY = GEMINI_API_KEY;

console.log(
  'GEMINI_API_KEY loaded in geminiService.ts:',
  API_KEY ? 'Exists' : 'MISSING or Empty',
);

if (!API_KEY) {
  console.error(
    "GEMINI_API_KEY is missing or empty. Please check your .env file and ensure it's correctly processed.",
  );
  throw new Error('Gemini API key is missing. Please check your .env file.');
}

const genAI = new GoogleGenAI({apiKey: API_KEY});

// --- Model Instances --- (No longer pre-creating model instances)
// const visionModel = genAI.models.getGenerativeModel({ ... }); // Removed
// const textModel = genAI.models.getGenerativeModel({ ... }); // Removed

// --- Helper for Image Data ---
// Converts an image file URI to the base64 format required by the Gemini API.
// Assumes imageData contains a 'uri' and optionally 'type' (e.g., 'image/jpeg').
interface ImageData {
  uri: string;
  type?: string; // e.g., 'image/jpeg', 'image/png'
  // Other potential fields from camera/picker (like width, height, base64 if already available)
  base64?: string;
}

async function imageToBase64(
  imageData: ImageData,
): Promise<{mimeType: string; data: string}> {
  const {uri, type, base64: precomputedBase64} = imageData;

  // If base64 is already provided (e.g., by some image pickers), use it directly.
  if (precomputedBase64) {
    console.log('Using precomputed base64 string.');
    const mimeType = type || 'image/jpeg'; // Default to JPEG if type isn't provided
    return {mimeType, data: precomputedBase64};
  }

  if (!uri) {
    throw new Error("Image data must contain a 'uri' or 'base64' property.");
  }

  console.log(`Reading image file from URI via expo-file-system: ${uri}`);
  try {
    // expo-file-system provides readAsStringAsync with EncodingType.Base64
    const base64String = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (!base64String) {
      throw new Error('expo-file-system returned an empty base64 string.');
    }
    // Attempt to infer MIME type from URI extension if not provided
    let mimeType = type;
    if (!mimeType) {
      const extension = uri.split('.').pop()?.toLowerCase();
      if (extension === 'png') {
        mimeType = 'image/png';
      } else if (extension === 'jpg' || extension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (extension === 'webp') {
        mimeType = 'image/webp'; // Check if Gemini supports webp directly
      } else {
        mimeType = 'image/jpeg'; // Default fallback
        console.warn(
          `Could not determine image type from URI extension '${extension}', defaulting to ${mimeType}`,
        );
      }
    }
    console.log(
      `Successfully converted image to base64. MimeType: ${mimeType}`,
    );
    return {mimeType, data: base64String};
  } catch (error) {
    console.error(`Error reading image file from URI ${uri}:`, error);
    throw new Error(
      `Failed to read or convert image file: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// --- Service Functions ---

/**
 * Analyzes an image to identify food items and their nutritional information.
 * @param imageData - The image data (URI or base64)
 * @returns A Promise resolving to FoodLogItemData for the primary identified food, or null if analysis fails.
 */
export const analyzeFoodImageWithGemini = async (
  imageData: ImageData,
): Promise<FoodLogItemData | null> => {
  const detailedPrompt = `
Analyze the food item(s) in this image. For each distinct food item, provide:
1. A concise name for the food item (e.g., "Banana", "Chicken Breast", "Mixed Salad").
2. A common or estimated serving size, including the unit (e.g., "1 medium", "100g", "1 cup", "1 slice").
3. Estimated nutritional information for that serving size:
    - Calories (kcal)
    - Protein (g)
    - Carbohydrates (g)
    - Fat (g)

If multiple food items are clearly distinguishable, provide details for each.
Prioritize the most prominent food item if unsure.
Return the output as a JSON object with a key "food_items", where the value is an array of objects. Each object in the array should represent a food item and have the following keys: "food_name", "serving_description", "calories", "protein", "carbs", "fat".

Example for a single item:
{
  "food_items": [
    {
      "food_name": "Apple",
      "serving_description": "1 medium (approx 182g)",
      "calories": 95,
      "protein": 0.5,
      "carbs": 25,
      "fat": 0.3
    }
  ]
}
Focus on common, generic versions of food items unless a brand is clearly identifiable and relevant.
Provide only the JSON output.
Do not include any introductory text or explanations outside of the JSON structure.
`.trim();

  try {
    const imagePart = await imageToBase64(imageData);
    const parts = [{text: detailedPrompt}, {inlineData: imagePart}];

    console.log('Sending request to Gemini API for image analysis...');
    const generationResult = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: [{role: 'user', parts}],
      config: {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        responseMimeType: 'application/json',
      },
    });

    const response = generationResult;

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        const rawJsonText = candidate.content.parts
          .map(part => part.text ?? '')
          .join('');
        console.log('Raw JSON text from Gemini:', rawJsonText);

        // Attempt to parse the JSON
        try {
          // Clean the response: Gemini might wrap JSON in markdown-like backticks
          const cleanedJsonText = rawJsonText
            .replace(/^```json\\n?|\\n?```$/g, '')
            .trim();
          const parsedResponse = JSON.parse(
            cleanedJsonText,
          ) as GeminiApiResponse;

          if (
            parsedResponse.food_items &&
            parsedResponse.food_items.length > 0
          ) {
            // For MVP, take the first item.
            // TODO: Future enhancement - allow user to select if multiple items are returned.
            const firstFoodItem = parsedResponse.food_items[0];

            // Validate the structure of the first food item
            if (
              typeof firstFoodItem.food_name === 'string' &&
              typeof firstFoodItem.serving_description === 'string' &&
              typeof firstFoodItem.calories === 'number' &&
              typeof firstFoodItem.protein === 'number' &&
              typeof firstFoodItem.carbs === 'number' &&
              typeof firstFoodItem.fat === 'number'
            ) {
              const foodLogData: FoodLogItemData = {
                food_name: firstFoodItem.food_name,
                calories: firstFoodItem.calories,
                protein: firstFoodItem.protein,
                carbs: firstFoodItem.carbs,
                fat: firstFoodItem.fat,
                serving_unit: firstFoodItem.serving_description,
              };
              console.log(
                'Successfully parsed Gemini response into FoodLogItemData:',
                foodLogData,
              );
              return foodLogData;
            } else {
              console.error(
                'Gemini response food_item has missing or invalid fields:',
                firstFoodItem,
              );
              return null;
            }
          } else {
            console.warn(
              "Gemini response parsed, but no food_items array found or it's empty:",
              parsedResponse,
            );
            return null;
          }
        } catch (parseError) {
          console.error(
            'Error parsing JSON response from Gemini:',
            parseError,
            'Raw text:',
            rawJsonText,
          );
          return null;
        }
      } else {
        console.warn(
          'Gemini response candidate missing content or parts:',
          candidate,
        );
        return null;
      }
    } else {
      const blockReason = response?.promptFeedback?.blockReason;
      const finishReason = response?.candidates?.[0]?.finishReason;
      console.error(
        `Gemini analysis failed. Block Reason: ${blockReason}, Finish Reason: ${finishReason}`,
        response,
      );
      return null;
    }
  } catch (error) {
    console.error('Error in analyzeFoodImageWithGemini:', error);
    return null; // Return null to indicate failure
  }
};

/**
 * Processes transcribed voice input to extract structured data (e.g., loggable food items).
 * @param text - The transcribed text from voice input.
 * @param prompt - The specific instruction for the AI (e.g., "Extract food items and quantities").
 * @returns A string with the processed result or structured data (consider returning JSON).
 */
export const processVoiceCommand = async (
  text: string,
  prompt: string = 'Parse the following text to identify food items and quantities logged. Format the output as a simple list.',
): Promise<string> => {
  try {
    const fullPrompt = `${prompt}\n\nText: "${text}"`;

    console.log(
      'Sending request to Gemini API for voice command processing...',
    );
    const generationResult = await genAI.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: [{role: 'user', parts: [{text: fullPrompt}]}],
    });

    const response = generationResult;

    if (
      response &&
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      const responseText = response.candidates[0].content.parts
        .map(part => part.text)
        .join('');
      return responseText || 'Could not extract text from response.';
    } else {
      // Handle potential blocking or empty response more safely
      const blockReason = response?.promptFeedback?.blockReason;
      const finishReason = response?.candidates?.[0]?.finishReason;
      let message = 'Processing failed';
      if (blockReason) message += `: Blocked - ${blockReason}`;
      if (finishReason) message += `: Finished - ${finishReason}`;
      if (!blockReason && !finishReason)
        message += '. No clear reason provided.';
      console.error(
        'Error or empty response from Gemini (processVoiceCommand):',
        message,
        response,
      );
      return message;
    }
  } catch (error) {
    console.error('Error processing voice command:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// --- Potential Future Functions ---

/**
 * Generates exercise plan suggestions based on user goals.
 * (Example placeholder)
 */
export const generateExercisePlan = (userGoals: string): Promise<string> => {
  // Implementation would involve calling textModel with appropriate prompts
  console.warn('generateExercisePlan not implemented');
  return Promise.resolve('Feature coming soon!'); // Wrap in Promise.resolve
};

/**
 * Parses natural language description of an exercise into structured data.
 * (Example placeholder)
 */
export const parseExerciseDescription = (
  description: string,
): Promise<string> => {
  // Implementation would involve calling textModel with appropriate prompts
  console.warn('parseExerciseDescription not implemented');
  return Promise.resolve('Feature coming soon!'); // Wrap in Promise.resolve
};
