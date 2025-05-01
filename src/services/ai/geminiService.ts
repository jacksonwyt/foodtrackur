import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system'; // Use Expo's cross-platform file system

// Basic configuration - adjust model name and safety settings as needed
const MODEL_NAME = "gemini-1.5-flash"; // For image analysis
const TEXT_MODEL_NAME = "gemini-1.5-flash"; // For text processing
const API_KEY = GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API key is missing. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// --- Model Instances ---
const visionModel = genAI.getGenerativeModel({
  model: MODEL_NAME,
  // Configure safety settings if needed (example below)
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
});

const textModel = genAI.getGenerativeModel({
  model: TEXT_MODEL_NAME,
  // Configure safety settings if needed
  // safetySettings: [ ... ],
});


// --- Helper for Image Data ---
// Converts an image file URI to the base64 format required by the Gemini API.
// Assumes imageData contains a 'uri' and optionally 'type' (e.g., 'image/jpeg').
interface ImageData {
  uri: string;
  type?: string; // e.g., 'image/jpeg', 'image/png'
  // Other potential fields from camera/picker (like width, height, base64 if already available)
  base64?: string;
}

async function imageToBase64(imageData: ImageData): Promise<{ mimeType: string; data: string }> {
  const { uri, type, base64: precomputedBase64 } = imageData;

  // If base64 is already provided (e.g., by some image pickers), use it directly.
  if (precomputedBase64) {
    console.log("Using precomputed base64 string.");
    const mimeType = type || 'image/jpeg'; // Default to JPEG if type isn't provided
    return { mimeType, data: precomputedBase64 };
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
        throw new Error("expo-file-system returned an empty base64 string.");
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
            console.warn(`Could not determine image type from URI extension '${extension}', defaulting to ${mimeType}`);
        }
    }
    console.log(`Successfully converted image to base64. MimeType: ${mimeType}`);
    return { mimeType, data: base64String };
  } catch (error) {
    console.error(`Error reading image file from URI ${uri}:`, error);
    throw new Error(`Failed to read or convert image file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- Service Functions ---

/**
 * Analyzes an image to identify food items.
 * @param imageData - The image data (format depends on source, e.g., from camera roll or capture)
 * @param prompt - Optional additional text prompt for the analysis.
 * @returns A string describing the identified food items or an error message.
 */
export const analyzeFoodImage = async (imageData: any, prompt: string = "Identify the food items in this image. List them clearly."): Promise<string> => {
  try {
    // 1. Convert image to base64 format required by Gemini API
    const imagePart = await imageToBase64(imageData);

    // 2. Prepare parts for the API call
    const parts = [
      { text: prompt },
      { inlineData: imagePart },
    ];

    // 3. Call the Gemini API
    const result = await visionModel.generateContent({ contents: [{ role: "user", parts }] });

    // 4. Process the response
    const response = result.response;
    if (response && response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        // Ensure content and parts exist before mapping
        if (candidate.content && candidate.content.parts) {
            const text = candidate.content.parts.map(part => part.text ?? '').join(""); // Use nullish coalescing for safety
            return text || "Could not extract text from response parts.";
        } else {
            // Handle cases where content or parts might be missing even if a candidate exists
            console.warn("Gemini response candidate missing content or parts:", candidate);
            return "Received an unexpected response structure from the AI.";
        }
    } else {
        // Handle potential blocking or empty response
        const blockReason = response?.promptFeedback?.blockReason;
        return `Analysis failed${blockReason ? `: ${blockReason}` : '.'}`;
    }

  } catch (error) {
    console.error("Error analyzing food image:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

/**
 * Processes transcribed voice input to extract structured data (e.g., loggable food items).
 * @param text - The transcribed text from voice input.
 * @param prompt - The specific instruction for the AI (e.g., "Extract food items and quantities").
 * @returns A string with the processed result or structured data (consider returning JSON).
 */
export const processVoiceCommand = async (text: string, prompt: string = "Parse the following text to identify food items and quantities logged. Format the output as a simple list."): Promise<string> => {
  try {
    // 1. Prepare the prompt
    const fullPrompt = `${prompt}

Text: "${text}"`;

    // 2. Call the Gemini API
    const result = await textModel.generateContent(fullPrompt);

    // 3. Process the response
    const response = result.response;
     if (response && response.candidates && response.candidates.length > 0) {
        const responseText = response.candidates[0].content.parts.map(part => part.text).join("");
        return responseText || "Could not extract text from response.";
    } else {
        // Handle potential blocking or empty response
        const blockReason = response?.promptFeedback?.blockReason;
        return `Processing failed${blockReason ? `: ${blockReason}` : '.'}`;
    }

  } catch (error) {
    console.error("Error processing voice command:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// --- Potential Future Functions ---

/**
 * Generates exercise plan suggestions based on user goals.
 * (Example placeholder)
 */
export const generateExercisePlan = async (userGoals: string): Promise<string> => {
  // Implementation would involve calling textModel with appropriate prompts
  console.warn("generateExercisePlan not implemented");
  return "Feature coming soon!";
};

/**
 * Parses natural language description of an exercise into structured data.
 * (Example placeholder)
 */
export const parseExerciseDescription = async (description: string): Promise<string> => {
  // Implementation would involve calling textModel with appropriate prompts
  console.warn("parseExerciseDescription not implemented");
  return "Feature coming soon!";
}; 