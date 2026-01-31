from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
from typing import Optional
from .steganography import embed_audio_lsb, extract_audio_lsb, audio_to_samples, samples_to_wav
from PIL import Image
import numpy as np

app = FastAPI(
    title="Zypher Steganography API",
    description="Audio steganography service using LSB encoding",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", "https://zypher.kartikey.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Zypher Steganography API",
        "version": "1.0.0",
        "endpoints": {
            "/encode": "Embed audio into image",
            "/decode": "Extract audio from image",
            "/capacity": "Calculate image capacity for audio"
        }
    }

@app.post("/encode")
async def encode_audio(
    audio: UploadFile = File(...),
    image: UploadFile = File(...)
):
    """
    Embed audio file into an image using LSB steganography.

    - **audio**: WAV audio file (max 5MB, 30 seconds)
    - **image**: PNG/JPG image (1024x1024 or larger recommended)

    Returns: PNG image with hidden audio
    """
    try:
        # Validate file types
        if not audio.content_type in ['audio/wav', 'audio/mpeg', 'audio/x-wav']:
            raise HTTPException(status_code=400, detail="Audio must be WAV format")

        if not image.content_type in ['image/png', 'image/jpeg', 'image/jpg']:
            raise HTTPException(status_code=400, detail="Image must be PNG or JPEG")

        # Read audio file
        audio_bytes = await audio.read()
        if len(audio_bytes) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="Audio file too large (max 5MB)")

        # Convert audio to samples
        samples, framerate = audio_to_samples(audio_bytes)

        # Validate audio duration (30 seconds max)
        duration = len(samples) / framerate
        if duration > 30:
            raise HTTPException(status_code=400, detail="Audio too long (max 30 seconds)")

        # Read image
        image_bytes = await image.read()
        img = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Check capacity
        pixels = img.width * img.height
        max_samples = (pixels - 1) * 2  # -1 for metadata pixel, *2 for R+G channels
        if len(samples) > max_samples:
            raise HTTPException(
                status_code=400,
                detail=f"Image too small. Needs {len(samples) / 2} pixels minimum"
            )

        # Embed audio
        encoded_img = embed_audio_lsb(img, samples, framerate)

        # Convert to bytes
        img_byte_arr = io.BytesIO()
        encoded_img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return Response(
            content=img_byte_arr.getvalue(),
            media_type="image/png",
            headers={
                "Content-Disposition": "attachment; filename=encoded.png"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/decode")
async def decode_audio(image: UploadFile = File(...)):
    """
    Extract audio from an image containing hidden data.

    - **image**: PNG image with embedded audio

    Returns: WAV audio file
    """
    try:
        # Validate file type
        if not image.content_type in ['image/png']:
            raise HTTPException(status_code=400, detail="Image must be PNG format")

        # Read image
        image_bytes = await image.read()
        img = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Extract audio
        samples, framerate = extract_audio_lsb(img)

        if len(samples) == 0:
            raise HTTPException(status_code=400, detail="No audio data found in image")

        # Convert samples to WAV
        wav_bytes = samples_to_wav(samples, framerate)

        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": "attachment; filename=decoded.wav"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/capacity")
async def calculate_capacity(
    width: int,
    height: int
):
    """
    Calculate the maximum audio capacity for an image of given dimensions.

    Returns maximum samples, duration, and file size.
    """
    pixels = width * height
    max_samples = (pixels - 1) * 2  # -1 for metadata, *2 for R+G channels

    # Assume 44.1kHz sample rate
    framerate = 44100
    max_duration = max_samples / framerate
    max_file_size_mb = (max_samples * 2) / (1024 * 1024)  # 16-bit samples

    return {
        "width": width,
        "height": height,
        "max_samples": max_samples,
        "max_duration_seconds": round(max_duration, 2),
        "max_file_size_mb": round(max_file_size_mb, 2),
        "sample_rate": framerate
    }

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
