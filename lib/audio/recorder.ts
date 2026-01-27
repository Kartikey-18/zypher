/**
 * Web Audio API Recorder
 *
 * Records audio from user's microphone using MediaRecorder API
 * Supports WAV format with duration limits
 */

export interface RecorderConfig {
  maxDuration?: number; // in seconds
  sampleRate?: number;
  mimeType?: string;
}

export interface RecordingResult {
  blob: Blob;
  url: string;
  duration: number;
  size: number;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private config: RecorderConfig;

  constructor(config: RecorderConfig = {}) {
    this.config = {
      maxDuration: config.maxDuration || 30, // 30 seconds default
      sampleRate: config.sampleRate || 44100,
      mimeType: config.mimeType || 'audio/webm', // Browser will use best available
    };
  }

  /**
   * Initialize and start recording
   */
  async start(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: 1, // Mono
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create MediaRecorder
      const options: MediaRecorderOptions = {};

      // Try to use the preferred MIME type
      if (MediaRecorder.isTypeSupported(this.config.mimeType!)) {
        options.mimeType = this.config.mimeType;
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];
      this.startTime = Date.now();

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();

      // Auto-stop after max duration
      if (this.config.maxDuration) {
        setTimeout(() => {
          if (this.mediaRecorder?.state === 'recording') {
            this.stop();
          }
        }, this.config.maxDuration * 1000);
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  /**
   * Stop recording and return result
   */
  async stop(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const duration = (Date.now() - this.startTime) / 1000;
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType });
        const url = URL.createObjectURL(blob);

        // Stop all tracks
        this.stream?.getTracks().forEach(track => track.stop());

        resolve({
          blob,
          url,
          duration,
          size: blob.size,
        });
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  /**
   * Get current recording state
   */
  getState(): RecordingState {
    return this.mediaRecorder?.state || 'inactive';
  }

  /**
   * Cancel recording
   */
  cancel(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.audioChunks = [];
    }
  }

  /**
   * Check if browser supports audio recording
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && window.MediaRecorder);
  }
}

/**
 * Validate audio file
 */
export function validateAudioFile(file: File, maxSize: number = 5 * 1024 * 1024): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/mp4'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Get audio duration from file
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      window.URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };

    audio.onerror = () => {
      reject(new Error('Failed to load audio file'));
    };

    audio.src = URL.createObjectURL(file);
  });
}

/**
 * Convert audio blob to WAV format (if needed)
 */
export async function convertToWAV(blob: Blob): Promise<Blob> {
  // For now, return as-is
  // In production, use a library like lamejs or audiobuffer-to-wav
  return blob;
}

export type RecordingState = 'inactive' | 'recording' | 'paused';
