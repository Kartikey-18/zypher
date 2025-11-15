import { NextRequest, NextResponse } from 'next/server';
import { generateImage, validatePrompt } from '@/lib/ai/huggingface';
import { buildPrompt } from '@/lib/ai/styles';

/**
 * POST /api/ai/generate
 *
 * Generate AI artwork using Stable Diffusion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style = 'photorealistic', width = 1024, height = 1024 } = body;

    // Validate prompt
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid prompt' },
        { status: 400 }
      );
    }

    // Build complete prompt with style
    const { prompt: fullPrompt, negativePrompt } = buildPrompt(prompt, style);

    // Generate image
    const startTime = Date.now();

    try {
      const result = await generateImage({
        prompt: fullPrompt,
        negativePrompt,
        width,
        height,
        numInferenceSteps: 30,
        guidanceScale: 7.5
      });

      // Convert blob to base64 for JSON response
      const arrayBuffer = await result.blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      return NextResponse.json({
        success: true,
        image: dataUrl,
        metadata: {
          prompt: fullPrompt,
          style,
          width: result.width,
          height: result.height,
          generationTime: result.generationTime,
          model: 'stabilityai/stable-diffusion-2-1'
        }
      });

    } catch (error: any) {
      console.error('Image generation error:', error);

      // Handle rate limiting
      if (error.message?.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        );
      }

      // Handle quota exceeded
      if (error.message?.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      throw error;
    }

  } catch (error: any) {
    console.error('API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/generate
 *
 * Get API status and available styles
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    model: 'stabilityai/stable-diffusion-2-1',
    maxDimensions: { width: 1024, height: 1024 },
    rateLimit: {
      maxRequests: 5,
      resetPeriod: '24 hours'
    }
  });
}
