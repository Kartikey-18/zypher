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
 * Convert audio blob to WAV format
 */
async function convertToWAV(audioBlob: Blob): Promise<Blob> {
  // Create an audio context
  const audioContext = new AudioContext();

  // Decode the audio data
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Convert to WAV
  const wavBlob = audioBufferToWav(audioBuffer);

  return wavBlob;
}

/**
 * Convert AudioBuffer to WAV blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = new Float32Array(buffer.length * numberOfChannels);

  // Interleave channels
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      data[i * numberOfChannels + channel] = channelData[i];
    }
  }

  const dataLength = data.length * bytesPerSample;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  let offset = 0;

  // "RIFF" chunk descriptor
  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, 36 + dataLength, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;

  // "fmt " sub-chunk
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4; // SubChunk1Size (16 for PCM)
  view.setUint16(offset, format, true); offset += 2; // AudioFormat (1 for PCM)
  view.setUint16(offset, numberOfChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true); offset += 4; // ByteRate
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, bitDepth, true); offset += 2;

  // "data" sub-chunk
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, dataLength, true); offset += 4;

  // Write audio data
  floatTo16BitPCM(view, offset, data);

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

/**
 * Encode audio into image
 */
export async function encodeAudioInImage(options: EncodeOptions): Promise<EncodeResult> {
  // Convert audio to WAV format
  const wavBlob = await convertToWAV(options.audioBlob);

  const formData = new FormData();
  formData.append('audio', wavBlob, 'audio.wav');
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
