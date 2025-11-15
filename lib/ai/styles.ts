/**
 * AI Art Style Presets
 *
 * Each style includes prompt modifiers and negative prompts
 * to achieve specific artistic effects with Stable Diffusion
 */

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  negativePrompt: string;
  example: string;
  emoji: string;
}

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'Ultra-realistic photography style with professional lighting',
    promptModifier: 'photorealistic, 8k uhd, high quality, professional photography, studio lighting, sharp focus, highly detailed',
    negativePrompt: 'cartoon, anime, painting, drawing, sketch, low quality, blurry, distorted',
    example: 'A serene mountain lake at sunset',
    emoji: '📷'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese animation style with vibrant colors',
    promptModifier: 'anime style, studio ghibli, vibrant colors, hand-drawn, cel shaded, beautiful anime art',
    negativePrompt: 'photorealistic, 3d render, western cartoon, ugly, distorted faces',
    example: 'Magical forest with glowing creatures',
    emoji: '🎨'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Modern abstract art with geometric patterns',
    promptModifier: 'abstract art, modern, geometric patterns, colorful, artistic, contemporary art, vivid colors',
    negativePrompt: 'realistic, photographic, plain, simple, monochrome',
    example: 'Swirling colors and geometric shapes',
    emoji: '🌈'
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classical oil painting with textured brushstrokes',
    promptModifier: 'oil painting, classical art, textured brushstrokes, masterpiece, renaissance style, artistic painting',
    negativePrompt: 'photograph, digital art, anime, cartoon, low quality',
    example: 'Peaceful countryside landscape',
    emoji: '🖼️'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon-lit cyberpunk aesthetic',
    promptModifier: 'cyberpunk style, neon lights, futuristic, blade runner aesthetic, sci-fi, dark atmosphere, high tech',
    negativePrompt: 'medieval, fantasy, natural, bright daylight, vintage',
    example: 'Neon-lit city streets at night',
    emoji: '🌃'
  }
];

/**
 * Get style by ID
 */
export function getStyleById(id: string): ArtStyle | undefined {
  return ART_STYLES.find(style => style.id === id);
}

/**
 * Build complete prompt with style modifiers
 */
export function buildPrompt(userPrompt: string, styleId: string): {
  prompt: string;
  negativePrompt: string;
} {
  const style = getStyleById(styleId);

  if (!style) {
    return {
      prompt: userPrompt,
      negativePrompt: 'low quality, blurry, distorted, ugly'
    };
  }

  return {
    prompt: `${userPrompt}, ${style.promptModifier}`,
    negativePrompt: style.negativePrompt
  };
}

/**
 * Example prompts for inspiration
 */
export const EXAMPLE_PROMPTS = [
  "A serene japanese garden with cherry blossoms",
  "Majestic dragon flying over mountains",
  "Cozy coffee shop on a rainy day",
  "Ancient library filled with magical books",
  "Sunset over a calm ocean beach",
  "Futuristic city with flying cars",
  "Enchanted forest with glowing mushrooms",
  "Space station orbiting a colorful nebula",
  "Medieval castle on a hilltop",
  "Underwater coral reef teeming with life"
];
