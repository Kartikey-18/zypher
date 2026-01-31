/**
 * Hugging Face Inference API Integration
 *
 * Uses Stable Diffusion for text-to-image generation
 * Free tier: 1000 requests/month
 */

export interface GenerateImageOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
}

export interface GeneratedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  generationTime: number;
}

/**
 * Generate image using Hugging Face Serverless Inference API (free tier)
 */
export async function generateImage(
  options: GenerateImageOptions,
  apiToken?: string
): Promise<GeneratedImage> {
  const startTime = Date.now();

  const token = apiToken || process.env.HUGGING_FACE_TOKEN;

  if (!token) {
    throw new Error('Hugging Face API token not configured');
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: options.prompt,
          parameters: {
            width: options.width || 1024,
            height: options.height || 1024,
            num_inference_steps: 4,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `HTTP ${response.status}`;

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API token. Please check your configuration.');
      }
      if (response.status === 503) {
        throw new Error('Model is loading. Please try again in a moment.');
      }

      throw new Error(`API error: ${errorMsg}`);
    }

    const blob = await response.blob();
    const generationTime = Date.now() - startTime;

    return {
      blob,
      url: '',
      width: options.width || 1024,
      height: options.height || 1024,
      generationTime,
    };

  } catch (error: any) {
    console.error('Hugging Face API error:', error);
    throw new Error(`Image generation failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Check if Hugging Face API is configured
 */
export function isHuggingFaceConfigured(): boolean {
  return !!process.env.HUGGING_FACE_TOKEN;
}

/**
 * Validate prompt (content moderation)
 */
export function validatePrompt(prompt: string): {
  valid: boolean;
  reason?: string;
} {
  // Basic validation
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, reason: 'Prompt cannot be empty' };
  }

  if (prompt.length > 500) {
    return { valid: false, reason: 'Prompt too long (max 500 characters)' };
  }

  // Content moderation (basic)
  const blockedWords = ['nsfw', 'nude', 'explicit', 'violence', 'gore'];
  const lowerPrompt = prompt.toLowerCase();

  for (const word of blockedWords) {
    if (lowerPrompt.includes(word)) {
      return { valid: false, reason: 'Prompt contains inappropriate content' };
    }
  }

  return { valid: true };
}
