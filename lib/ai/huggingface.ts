/**
 * Hugging Face Inference API Integration
 *
 * Uses Stable Diffusion for text-to-image generation
 * Free tier: 1000 requests/month
 */

import { HfInference } from '@huggingface/inference';

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
 * Generate image using Hugging Face Inference API
 */
export async function generateImage(
  options: GenerateImageOptions,
  apiToken?: string
): Promise<GeneratedImage> {
  const startTime = Date.now();

  // Use API token from parameter or environment
  const token = apiToken || process.env.HUGGING_FACE_TOKEN;

  if (!token) {
    throw new Error('Hugging Face API token not configured');
  }

  const hf = new HfInference(token);

  try {
    // Generate image using Stable Diffusion
    const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-2-1',
      inputs: options.prompt,
      parameters: {
        negative_prompt: options.negativePrompt || 'low quality, blurry, distorted',
        width: options.width || 1024,
        height: options.height || 1024,
        num_inference_steps: options.numInferenceSteps || 30,
        guidance_scale: options.guidanceScale || 7.5,
      }
    });

    const generationTime = Date.now() - startTime;

    // Convert to blob and create URL
    const blob = result;
    const url = URL.createObjectURL(blob);

    return {
      blob,
      url,
      width: options.width || 1024,
      height: options.height || 1024,
      generationTime
    };

  } catch (error: any) {
    console.error('Hugging Face API error:', error);

    // Handle specific errors
    if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (error.message?.includes('authorization')) {
      throw new Error('Invalid API token. Please check your configuration.');
    }

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
