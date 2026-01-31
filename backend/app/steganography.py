"""
LSB (Least Significant Bit) Steganography for Audio in Images

This module implements audio hiding in images using LSB encoding.
Metadata (framerate, sample count) is stored in the first 2 pixels.
Audio samples are distributed across R and G channels of subsequent pixels.
Blue channel is preserved for better visual quality.
"""

import numpy as np
from PIL import Image
import struct
import wave
import io


def audio_to_samples(audio_bytes: bytes) -> tuple[np.ndarray, int]:
    """
    Convert WAV audio bytes to numpy array of samples.

    Args:
        audio_bytes: Raw WAV file bytes

    Returns:
        tuple: (samples array, sample rate)
    """
    # Read WAV file from bytes
    with wave.open(io.BytesIO(audio_bytes), 'rb') as wav_file:
        framerate = wav_file.getframerate()
        n_channels = wav_file.getnchannels()
        sampwidth = wav_file.getsampwidth()
        n_frames = wav_file.getnframes()

        # Read raw audio data
        audio_data = wav_file.readframes(n_frames)

    # Convert to numpy array
    if sampwidth == 1:  # 8-bit
        samples = np.frombuffer(audio_data, dtype=np.uint8)
        samples = (samples.astype(np.int16) - 128) * 256  # Convert to 16-bit
    elif sampwidth == 2:  # 16-bit
        samples = np.frombuffer(audio_data, dtype=np.int16)
    else:
        raise ValueError(f"Unsupported sample width: {sampwidth} bytes")

    # Convert stereo to mono if needed
    if n_channels == 2:
        samples = samples.reshape(-1, 2).mean(axis=1).astype(np.int16)

    return samples, framerate


def samples_to_wav(samples: np.ndarray, framerate: int) -> bytes:
    """
    Convert numpy array of samples to WAV bytes.

    Args:
        samples: Audio samples as int16 array
        framerate: Sample rate in Hz

    Returns:
        bytes: WAV file as bytes
    """
    # Ensure samples are int16
    samples = samples.astype(np.int16)

    # Create WAV file in memory
    wav_io = io.BytesIO()
    with wave.open(wav_io, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(framerate)
        wav_file.writeframes(samples.tobytes())

    return wav_io.getvalue()


def embed_audio_lsb(img: Image.Image, samples: np.ndarray, framerate: int) -> Image.Image:
    """
    Embed audio samples into image using LSB steganography.
    Uses 1 byte per pixel (R and G channels, 4 bits each).

    Args:
        img: PIL Image object (RGB)
        samples: Audio samples as int16 numpy array
        framerate: Sample rate in Hz

    Returns:
        PIL Image with embedded audio
    """
    # Ensure image is RGB
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Create copy of image
    img_array = np.array(img, dtype=np.uint8).copy()
    height, width, channels = img_array.shape

    # Convert samples to unsigned 16-bit
    samples_unsigned = (samples.astype(np.int32) + 32768).astype(np.uint16)
    sample_bytes = samples_unsigned.tobytes()

    # Validate capacity (1 byte per pixel using R+G channels)
    available_pixels = width * height - 2  # -2 for metadata pixels
    required_pixels = len(sample_bytes)

    if required_pixels > available_pixels:
        raise ValueError(f"Image too small: need {required_pixels} pixels, have {available_pixels}")

    # Encode metadata in first 2 pixels
    # Pixel 0: framerate_khz (R), sample_count byte 0 (G), sample_count byte 1 (B)
    # Pixel 1: sample_count byte 2 (R), sample_count byte 3 (G), unused (B)
    framerate_khz = min(framerate // 1000, 255)
    sample_count = len(samples)

    # First pixel
    img_array[0, 0, 0] = framerate_khz
    img_array[0, 0, 1] = sample_count & 0xFF
    img_array[0, 0, 2] = (sample_count >> 8) & 0xFF

    # Flatten image for easier indexing
    flat_img = img_array.reshape(-1, 3)

    # Second pixel for higher bytes (supports up to 4.2 billion samples)
    flat_img[1, 0] = (sample_count >> 16) & 0xFF
    flat_img[1, 1] = (sample_count >> 24) & 0xFF

    # Embed each byte into one pixel (using R and G channels)
    for i, byte_val in enumerate(sample_bytes):
        pixel_idx = i + 2  # +2 to skip metadata pixels
        if pixel_idx >= len(flat_img):
            break

        # Store high nibble in R channel, low nibble in G channel
        flat_img[pixel_idx, 0] = (flat_img[pixel_idx, 0] & 0xF0) | ((byte_val >> 4) & 0x0F)
        flat_img[pixel_idx, 1] = (flat_img[pixel_idx, 1] & 0xF0) | (byte_val & 0x0F)

    # Reshape back to image dimensions
    img_array = flat_img.reshape(height, width, 3)

    return Image.fromarray(img_array, mode='RGB')


def extract_audio_lsb(img: Image.Image) -> tuple[np.ndarray, int]:
    """
    Extract audio samples from image using LSB steganography.

    Args:
        img: PIL Image object with embedded audio

    Returns:
        tuple: (samples array, sample rate)
    """
    img_array = np.array(img, dtype=np.uint8)
    height, width, _ = img_array.shape

    # Flatten image for easier indexing
    flat_img = img_array.reshape(-1, 3)

    # Extract metadata from first 2 pixels
    # Pixel 0: framerate_khz (R), sample_count byte 0 (G), sample_count byte 1 (B)
    # Pixel 1: sample_count byte 2 (R), sample_count byte 3 (G), unused (B)
    framerate_khz = flat_img[0, 0]
    sample_count_byte0 = flat_img[0, 1]
    sample_count_byte1 = flat_img[0, 2]
    sample_count_byte2 = flat_img[1, 0]
    sample_count_byte3 = flat_img[1, 1]

    framerate = framerate_khz * 1000
    sample_count = (sample_count_byte0 |
                    (sample_count_byte1 << 8) |
                    (sample_count_byte2 << 16) |
                    (sample_count_byte3 << 24))

    if framerate == 0 or sample_count == 0:
        return np.array([], dtype=np.int16), 44100

    # Sanity check: sample_count shouldn't exceed available pixels
    max_possible_samples = (len(flat_img) - 2) // 2
    if sample_count > max_possible_samples:
        raise ValueError("No valid audio data found in this image")

    # Calculate number of bytes to extract
    num_bytes = sample_count * 2  # 16-bit samples = 2 bytes each

    # Extract bytes from pixels
    extracted_bytes = []
    for i in range(num_bytes):
        pixel_idx = i + 2  # +2 to skip metadata pixels
        if pixel_idx >= len(flat_img):
            break

        # Reconstruct byte from R and G channels
        high_nibble = int(flat_img[pixel_idx, 0]) & 0x0F
        low_nibble = int(flat_img[pixel_idx, 1]) & 0x0F
        byte_val = (high_nibble << 4) | low_nibble
        extracted_bytes.append(byte_val)

    # Convert bytes to uint16 samples
    samples_unsigned = np.frombuffer(bytes(extracted_bytes[:num_bytes]), dtype=np.uint16)

    # Convert back to signed int16
    samples = (samples_unsigned.astype(np.int32) - 32768).astype(np.int16)

    return samples[:sample_count], framerate
