"""
LSB (Least Significant Bit) Steganography for Audio in Images

This module implements audio hiding in images using LSB encoding.
Metadata (framerate, sample count) is stored in the first pixel.
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

    Metadata format (first pixel):
    - R channel: framerate / 1000 (supports up to 255 kHz)
    - G channel: sample count (low byte)
    - B channel: sample count (high byte)

    Audio encoding:
    - Each sample (16-bit) split into 2 bytes
    - Low byte → R channel LSB
    - High byte → G channel LSB
    - B channel preserved for visual quality

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

    # Validate capacity
    available_pixels = width * height - 1  # -1 for metadata pixel
    required_pixels = (len(samples) + 1) // 2  # 2 bytes per pixel (R+G)

    if required_pixels > available_pixels:
        raise ValueError(f"Image too small: need {required_pixels} pixels, have {available_pixels}")

    # Encode metadata in first pixel (top-left)
    framerate_khz = min(framerate // 1000, 255)
    sample_count = len(samples)
    img_array[0, 0, 0] = framerate_khz  # R: framerate/1000
    img_array[0, 0, 1] = sample_count & 0xFF  # G: count low byte
    img_array[0, 0, 2] = (sample_count >> 8) & 0xFF  # B: count high byte

    # Convert samples to unsigned 16-bit for easier processing
    samples_unsigned = (samples.astype(np.int32) + 32768).astype(np.uint16)

    # Flatten image pixels (skip first pixel)
    flat_pixels = img_array.reshape(-1, 3)[1:]

    # Embed audio bytes into R and G channels
    pixel_idx = 0
    for i in range(0, len(samples_unsigned), 2):
        if pixel_idx >= len(flat_pixels):
            break

        # First sample
        sample1 = samples_unsigned[i]
        low_byte1 = sample1 & 0xFF
        high_byte1 = (sample1 >> 8) & 0xFF

        # Clear LSB and set new value for R channel (low byte)
        flat_pixels[pixel_idx, 0] = (flat_pixels[pixel_idx, 0] & 0xFE) | (low_byte1 & 0x01)

        # For higher capacity, we use multiple LSBs
        # Use 2 LSBs for better capacity vs quality trade-off
        flat_pixels[pixel_idx, 0] = (flat_pixels[pixel_idx, 0] & 0xFC) | (low_byte1 & 0x03)
        flat_pixels[pixel_idx, 1] = (flat_pixels[pixel_idx, 1] & 0xFC) | ((low_byte1 >> 2) & 0x03)

        # Continue with remaining bits
        flat_pixels[pixel_idx, 0] = (flat_pixels[pixel_idx, 0] & 0xF0) | ((low_byte1 >> 4) & 0x0F)
        flat_pixels[pixel_idx, 1] = (flat_pixels[pixel_idx, 1] & 0xF0) | (high_byte1 & 0x0F)

        # Second sample (if exists)
        if i + 1 < len(samples_unsigned):
            sample2 = samples_unsigned[i + 1]
            low_byte2 = sample2 & 0xFF
            high_byte2 = (sample2 >> 8) & 0xFF

            # Use next pixel or continue with current
            if pixel_idx + 1 < len(flat_pixels):
                pixel_idx += 1
                flat_pixels[pixel_idx, 0] = (flat_pixels[pixel_idx, 0] & 0xF0) | ((low_byte2 >> 4) & 0x0F)
                flat_pixels[pixel_idx, 1] = (flat_pixels[pixel_idx, 1] & 0xF0) | (high_byte2 & 0x0F)

        pixel_idx += 1

    # Reshape back to image dimensions
    img_array[1:] = flat_pixels.reshape(height * width - 1, 3)

    # Actually, let's use a simpler, more reliable method:
    # Store each byte directly in the lower 4 bits of pixels

    # Reset and use simpler encoding
    img_array = np.array(img, dtype=np.uint8)

    # Metadata in first pixel
    img_array[0, 0, 0] = framerate_khz
    img_array[0, 0, 1] = sample_count & 0xFF
    img_array[0, 0, 2] = (sample_count >> 8) & 0xFF

    # Convert samples to bytes
    sample_bytes = samples_unsigned.tobytes()

    # Flatten pixels (skip first)
    flat_pixels = img_array.reshape(-1, 3)[1:]

    # Embed bytes (2 bytes per pixel using R and G channels)
    for i in range(0, len(sample_bytes), 2):
        pixel_idx = i // 2
        if pixel_idx >= len(flat_pixels):
            break

        # Store byte in lower 4 bits of R channel
        byte1 = sample_bytes[i]
        flat_pixels[pixel_idx, 0] = (flat_pixels[pixel_idx, 0] & 0xF0) | ((byte1 >> 4) & 0x0F)
        flat_pixels[pixel_idx, 1] = (flat_pixels[pixel_idx, 1] & 0xF0) | (byte1 & 0x0F)

        # Store second byte if available
        if i + 1 < len(sample_bytes):
            byte2 = sample_bytes[i + 1]
            # We need another pixel or use B channel
            # For simplicity, use the next pixel
            if pixel_idx + 1 < len(flat_pixels):
                flat_pixels[pixel_idx + 1, 0] = (flat_pixels[pixel_idx + 1, 0] & 0xF0) | ((byte2 >> 4) & 0x0F)
                flat_pixels[pixel_idx + 1, 1] = (flat_pixels[pixel_idx + 1, 1] & 0xF0) | (byte2 & 0x0F)

    # Reshape back - properly assign the flattened pixels back to the image array
    reshaped = img_array.reshape(-1, 3)
    reshaped[1:] = flat_pixels
    img_array = reshaped.reshape(height, width, 3)

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

    # Extract metadata from first pixel
    framerate_khz = img_array[0, 0, 0]
    sample_count_low = img_array[0, 0, 1]
    sample_count_high = img_array[0, 0, 2]

    framerate = framerate_khz * 1000
    sample_count = sample_count_low | (sample_count_high << 8)

    if framerate == 0 or sample_count == 0:
        return np.array([], dtype=np.int16), 44100

    # Flatten pixels (skip first)
    flat_pixels = img_array.reshape(-1, 3)[1:]

    # Calculate number of bytes to extract
    num_bytes = sample_count * 2  # 16-bit samples = 2 bytes each

    # Extract bytes from pixels
    extracted_bytes = []
    for i in range(0, num_bytes, 2):
        pixel_idx = i // 2
        if pixel_idx >= len(flat_pixels):
            break

        # Reconstruct byte from R and G channels
        high_nibble = flat_pixels[pixel_idx, 0] & 0x0F
        low_nibble = flat_pixels[pixel_idx, 1] & 0x0F
        byte1 = (high_nibble << 4) | low_nibble
        extracted_bytes.append(byte1)

        # Second byte
        if i + 1 < num_bytes and pixel_idx + 1 < len(flat_pixels):
            high_nibble = flat_pixels[pixel_idx + 1, 0] & 0x0F
            low_nibble = flat_pixels[pixel_idx + 1, 1] & 0x0F
            byte2 = (high_nibble << 4) | low_nibble
            extracted_bytes.append(byte2)

    # Convert bytes to uint16 samples
    samples_unsigned = np.frombuffer(bytes(extracted_bytes[:num_bytes]), dtype=np.uint16)

    # Convert back to signed int16
    samples = (samples_unsigned.astype(np.int32) - 32768).astype(np.int16)

    return samples[:sample_count], framerate
