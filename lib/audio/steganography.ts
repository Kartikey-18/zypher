/**
 * Steganography Client Integration
 *
 * Connects to Python FastAPI backend for audio hiding/extraction
 */

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API || 'http://localhost:8000';

export interface EncodeOptions {
  audioBlob: Blob;
  imageBlob: Blob;
}

export interface EncodeResult {
  encodedImage: Blob;
  url: string;
  metadata: {
    audioSize: number;
    imageSize: number;
    encodedSize: number;
  };
}

export interface DecodeResult {
  audioBlob: Blob;
  url: string;
  metadata: {
    duration: number;
    size: number;
  };
}

/**
 * Encode audio into image
 */
export async function encodeAudioInImage(options: EncodeOptions): Promise<EncodeResult> {
  const formData = new FormData();
  formData.append('audio', options.audioBlob, 'audio.webm');
  formData.append('image', options.imageBlob, 'image.png');

  try {
    const response = await fetch(`${PYTHON_API_URL}/encode`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to encode audio');
    }

    const encodedBlob = await response.blob();
    const url = URL.createObjectURL(encodedBlob);

    return {
      encodedImage: encodedBlob,
      url,
      metadata: {
        audioSize: options.audioBlob.size,
        imageSize: options.imageBlob.size,
        encodedSize: encodedBlob.size,
      },
    };
  } catch (error: any) {
    console.error('Encode error:', error);
    throw new Error(`Failed to encode audio: ${error.message}`);
  }
}

/**
 * Decode audio from image
 */
export async function decodeAudioFromImage(imageBlob: Blob): Promise<DecodeResult> {
  const formData = new FormData();
  formData.append('image', imageBlob, 'encoded.png');

  try {
    const response = await fetch(`${PYTHON_API_URL}/decode`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to decode audio');
    }

    const audioBlob = await response.blob();
    const url = URL.createObjectURL(audioBlob);

    return {
      audioBlob,
      url,
      metadata: {
        duration: 0, // Will be calculated by audio element
        size: audioBlob.size,
      },
    };
  } catch (error: any) {
    console.error('Decode error:', error);
    throw new Error(`Failed to decode audio: ${error.message}`);
  }
}

/**
 * Check if Python backend is available
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Calculate image capacity for audio
 */
export async function calculateCapacity(width: number, height: number): Promise<{
  maxSamples: number;
  maxDurationSeconds: number;
  maxFileSizeMB: number;
}> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/capacity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ width, height }),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate capacity');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Capacity calculation error:', error);
    throw error;
  }
}

/**
 * Convert image URL to Blob
 */
export async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

/**
 * Convert base64 data URL to Blob
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const contentType = parts[0].split(':')[1].split(';')[0];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
