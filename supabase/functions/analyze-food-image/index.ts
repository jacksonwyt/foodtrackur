import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// Relying on 'jsr:@supabase/functions-js/edge-runtime.d.ts' and the
// supabase/functions/tsconfig.json (with "deno.ns", "deno.window" libs)
// to provide global Deno types.

import {
  serve,
  ServerRequest, // This should now be correctly typed from deno.land/std
} from 'https://deno.land/std@0.177.0/http/server.ts';

// The 'declare global { namespace Deno ... }' block should no longer be needed.

interface HarmCategoryMap {
  HARM_CATEGORY_UNSPECIFIED: string;
  HARM_CATEGORY_HARASSMENT: string;
  HARM_CATEGORY_HATE_SPEECH: string;
  HARM_CATEGORY_SEXUALLY_EXPLICIT: string;
  HARM_CATEGORY_DANGEROUS_CONTENT: string;
}

interface HarmBlockThresholdMap {
  BLOCK_NONE: string;
  BLOCK_ONLY_HIGH: string;
  BLOCK_MEDIUM_AND_ABOVE: string;
  BLOCK_LOW_AND_ABOVE: string;
}

interface SafetySetting {
  category: HarmCategoryMap[keyof HarmCategoryMap];
  threshold: HarmBlockThresholdMap[keyof HarmBlockThresholdMap];
}

interface ContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface Content {
  parts: ContentPart[];
  role: string;
}

interface Candidate {
  content: Content;
  finishReason?: string;
  safetyRatings?: SafetySetting[];
}

interface PromptFeedback {
  blockReason?: string;
  blockReasonMessage?: string;
  safetyRatings?: SafetySetting[];
}

interface GenerationResponse {
  candidates?: Candidate[];
  promptFeedback?: PromptFeedback;
}

interface GenerationResult {
  response: GenerationResponse;
}

interface GenerativeModel {
  generateContent(params: {contents: Content[]}): Promise<GenerationResult>;
}

interface GoogleGenerativeAIConstructor {
  new (apiKey: string): GoogleGenerativeAIInstance;
}

interface GoogleGenerativeAIInstance {
  getGenerativeModel(params: {
    model: string;
    safetySettings?: SafetySetting[];
  }): GenerativeModel;
}

// Assuming GoogleGenerativeAI etc. are available on globalThis in the Deno environment
// If these are still problematic, ensure they are correctly provided by the Deno runtime
// or the generative-ai SDK when used in Deno.
// The 'MyGlobalThisShape' workaround might still be useful if they aren't standard Deno globals.
interface MyGlobalThisShape {
    GoogleGenerativeAI: GoogleGenerativeAIConstructor;
    HarmCategory: HarmCategoryMap; // Or the actual type from the SDK if it's global
    HarmBlockThreshold: HarmBlockThresholdMap; // Or the actual type from the SDK
}
const myGlobals = globalThis as unknown as MyGlobalThisShape;

const GoogleGenerativeAI = myGlobals.GoogleGenerativeAI;
const HarmCategory = myGlobals.HarmCategory;
const HarmBlockThreshold = myGlobals.HarmBlockThreshold;

const MODEL_NAME = 'gemini-1.5-flash';

// Deno.env.get should be correctly typed now by "deno.ns" lib
const apiKeyFromEnv = Deno.env.get('GEMINI_API_KEY');
// Explicit typing for API_KEY is still good practice
const API_KEY: string | undefined = typeof apiKeyFromEnv === 'string' ? apiKeyFromEnv : undefined;

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable not set.');
}

let visionModel: GenerativeModel | undefined;
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  visionModel = genAI.getGenerativeModel({
    model: MODEL_NAME,
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
  });
  console.log('Gemini Vision Model initialized.');
} else {
  console.warn('Gemini model not initialized due to missing API key.');
}

interface RequestPayload {
  imageData: {
    mimeType: string;
    data: string;
  };
  prompt?: string;
}

console.log('Analyze Food Image Edge Function started.');

// 'serve' and 'req: ServerRequest' should now be correctly typed
serve(async (req: ServerRequest): Promise<Response> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  };

  // req.method should be available from ServerRequest type
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders});
  }

  try {
    if (!API_KEY || !visionModel) {
      return new Response(
        JSON.stringify({error: 'AI service not configured on server.'}),
        {
          headers: {...corsHeaders, 'Content-Type': 'application/json'},
          status: 500,
        },
      );
    }

    // req.text() should be available and return Promise<string>
    const bodyText: string = await req.text();

    const payload = JSON.parse(bodyText) as RequestPayload;
    const {imageData, prompt: customPrompt} = payload;

    if (!imageData || !imageData.mimeType || !imageData.data) {
      return new Response(
        JSON.stringify({
          error:
            'Invalid request body: Missing imageData with mimeType and data.',
        }),
        {
          headers: {...corsHeaders, 'Content-Type': 'application/json'},
          status: 400,
        },
      );
    }

    const defaultPrompt =
      'Identify the food items in this image. List them clearly.';
    const promptToUse = customPrompt || defaultPrompt;
    const imagePart = {inlineData: imageData};

    const parts: ContentPart[] = [{text: promptToUse}, imagePart];

    console.log(
      `Calling Gemini API with prompt: "${promptToUse}" and image type: ${imageData.mimeType}`,
    );

    const result: GenerationResult = await visionModel.generateContent({
      contents: [{role: 'user', parts}],
    });
    const response = result.response;

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (
        candidate.content &&
        candidate.content.parts &&
        Array.isArray(candidate.content.parts)
      ) {
        const text = candidate.content.parts
          .map((part: ContentPart) => {
            if (part && typeof part.text === 'string') {
              return part.text;
            }
            return '';
          })
          .join('');
        console.log('Gemini analysis successful.');
        return new Response(
          JSON.stringify({
            analysis: text || 'Could not extract text from response parts.',
          }),
          {
            headers: {...corsHeaders, 'Content-Type': 'application/json'},
            status: 200,
          },
        );
      } else {
        console.warn(
          'Gemini response candidate missing content or parts:',
          candidate,
        );
        return new Response(
          JSON.stringify({
            error: 'Received an unexpected response structure from the AI.',
          }),
          {
            headers: {...corsHeaders, 'Content-Type': 'application/json'},
            status: 500,
          },
        );
      }
    } else {
      const blockReason = response?.promptFeedback?.blockReason;
      const blockReasonMessage = response?.promptFeedback?.blockReasonMessage;
      let errorMessage = `Analysis failed`;
      if (blockReason) {
        errorMessage += `: ${blockReason}`;
        if (blockReasonMessage) {
          errorMessage += ` - ${blockReasonMessage}`;
        }
      } else {
        errorMessage += '.';
      }
      console.warn(
        `Gemini analysis failed. Block Reason: ${blockReason || 'N/A'}${blockReasonMessage ? ` (${blockReasonMessage})` : ''}`,
      );
      return new Response(JSON.stringify({error: errorMessage}), {
        headers: {...corsHeaders, 'Content-Type': 'application/json'},
        status: 500,
      });
    }
  } catch (error: unknown) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes('Unexpected token') ||
      errorMessage.includes('invalid json')
    ) {
      return new Response(
        JSON.stringify({error: 'Invalid JSON in request body.'}),
        {
          headers: {...corsHeaders, 'Content-Type': 'application/json'},
          status: 400,
        },
      );
    }
    return new Response(
      JSON.stringify({error: `Internal Server Error: ${errorMessage}`}),
      {
        headers: {...corsHeaders, 'Content-Type': 'application/json'},
        status: 500,
      },
    );
  }
});

console.log('Analyze Food Image Edge Function ready to serve requests.');
