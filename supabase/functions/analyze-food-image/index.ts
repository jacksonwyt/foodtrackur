/// <reference types="https://esm.sh/v135/@types/deno@1.41.1/index.d.ts" />
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// Use direct URL import instead of relying on import map or local node_modules resolution
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "https://esm.sh/@google/generative-ai@^0.16.0"

// Constants from your original service
const MODEL_NAME = "gemini-1.5-flash";

// Retrieve the API key from environment variables (set via Supabase secrets)
const API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable not set.");
  // Don't throw here, handle it gracefully in the request
}

// Initialize the Gemini client (only if API key is present)
let visionModel: any; // Use 'any' for now, or import specific types if needed
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  visionModel = genAI.getGenerativeModel({
    model: MODEL_NAME,
    // Same safety settings as your original service
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });
  console.log("Gemini Vision Model initialized.");
} else {
  console.warn("Gemini model not initialized due to missing API key.");
}

// Define the expected request body structure
interface RequestPayload {
  imageData: {
    mimeType: string;
    data: string; // Base64 encoded image data
  };
  prompt?: string; // Optional prompt override
}

console.log("Analyze Food Image Edge Function started.");

serve(async (req: Request) => {
  // --- CORS Headers ---
  // Necessary for invocation from a browser/app
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust for production!
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // --- Request Processing ---
  try {
    // Check if API key is available
    if (!API_KEY || !visionModel) {
        return new Response(JSON.stringify({ error: "AI service not configured on server." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    // Parse request body
    const payload: RequestPayload = await req.json();
    const { imageData, prompt: customPrompt } = payload;

    // Validate input
    if (!imageData || !imageData.mimeType || !imageData.data) {
      return new Response(JSON.stringify({ error: 'Invalid request body: Missing imageData with mimeType and data.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Prepare parts for the Gemini API
    const defaultPrompt = "Identify the food items in this image. List them clearly.";
    const promptToUse = customPrompt || defaultPrompt;
    const imagePart = { inlineData: imageData }; // Use directly from request

    const parts = [
      { text: promptToUse },
      imagePart,
    ];

    console.log(`Calling Gemini API with prompt: "${promptToUse}" and image type: ${imageData.mimeType}`);

    // Call the Gemini API
    const result = await visionModel.generateContent({ contents: [{ role: "user", parts }] });
    const response = result.response;

    // Process the response
    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        const text = candidate.content.parts.map((part: any) => part.text ?? '').join(""); // Use 'any' for simplicity here
        console.log("Gemini analysis successful.");
        return new Response(JSON.stringify({ analysis: text || "Could not extract text from response parts." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        console.warn("Gemini response candidate missing content or parts:", candidate);
        return new Response(JSON.stringify({ error: "Received an unexpected response structure from the AI." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
    } else {
      const blockReason = response?.promptFeedback?.blockReason;
      const errorMessage = `Analysis failed${blockReason ? `: ${blockReason}` : '.'}`;
      console.warn(`Gemini analysis failed. Block Reason: ${blockReason || 'N/A'}`);
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500, // Or potentially 400/503 depending on block reason
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Check for specific JSON parsing errors
    if (errorMessage.includes('Unexpected token') || errorMessage.includes('invalid json')) {
        return new Response(JSON.stringify({ error: 'Invalid JSON in request body.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
    return new Response(JSON.stringify({ error: `Internal Server Error: ${errorMessage}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

console.log("Analyze Food Image Edge Function ready to serve requests.");

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-food-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
