import { NextResponse } from 'next/server';
import { ART_STYLES } from '@/lib/ai/styles';

/**
 * GET /api/ai/styles
 *
 * Get available art styles
 */
export async function GET() {
  return NextResponse.json({
    styles: ART_STYLES.map(style => ({
      id: style.id,
      name: style.name,
      description: style.description,
      example: style.example,
      emoji: style.emoji
    }))
  });
}
