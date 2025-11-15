"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Info, Zap, Lock, Image as ImageIcon, Upload, Play, Pause, Volume2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StyleSelector from "@/components/ai/StyleSelector";
import PromptInput from "@/components/ai/PromptInput";
import GenerationProgress from "@/components/ai/GenerationProgress";
import AudioRecorder from "@/components/audio/AudioRecorder";
import { ART_STYLES } from "@/lib/ai/styles";
import { checkRateLimit, incrementRateLimit, getTimeUntilReset, RateLimitInfo } from "@/lib/ai/rate-limiter";
import { RecordingResult } from "@/lib/audio/recorder";
import { encodeAudioInImage, dataURLToBlob, checkBackendStatus, decodeAudioFromImage } from "@/lib/audio/steganography";

type WorkflowStep = 'record' | 'generate' | 'encode' | 'complete';

export default function AIArtVaultPage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('record');
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({ remaining: 5, total: 5 });
  const [audioRecording, setAudioRecording] = useState<RecordingResult | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  // Decode state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedAudio, setDecodedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setRateLimit(checkRateLimit());
    checkBackend();
  }, []);

  const checkBackend = async () => {
    const available = await checkBackendStatus();
    setBackendAvailable(available);
  };

  const handleRecordingComplete = (result: RecordingResult) => {
    setAudioRecording(result);
    setCurrentStep('generate');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    const limitInfo = checkRateLimit();
    if (limitInfo.remaining <= 0) {
      setError(`Rate limit exceeded. Reset in ${getTimeUntilReset()}`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setMetadata(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          width: 1024,
          height: 1024
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(data.image);
      setMetadata(data.metadata);
      setCurrentStep('encode');

      const newLimit = incrementRateLimit();
      setRateLimit(newLimit);

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEncode = async () => {
    if (!audioRecording || !generatedImage) {
      setError("Missing audio or image");
      return;
    }

    if (!backendAvailable) {
      setError("Python backend not available. Please start the backend server.");
      return;
    }

    setIsEncoding(true);
    setError(null);

    try {
      const imageBlob = dataURLToBlob(generatedImage);

      const result = await encodeAudioInImage({
        audioBlob: audioRecording.blob,
        imageBlob: imageBlob
      });

      setEncodedImage(result.url);
      setCurrentStep('complete');

    } catch (err: any) {
      console.error('Encoding error:', err);
      setError(err.message || 'Failed to encode audio into image');
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setCurrentStep('record');
    setAudioRecording(null);
    setGeneratedImage(null);
    setEncodedImage(null);
    setMetadata(null);
    setError(null);
    setPrompt("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploadedImage(file);
    setUploadedImagePreview(URL.createObjectURL(file));
    setDecodedAudio(null);
    setError(null);
  };

  const handleDecode = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    if (!backendAvailable) {
      setError('Python backend not available. Please start the backend server.');
      return;
    }

    setIsDecoding(true);
    setError(null);

    try {
      const result = await decodeAudioFromImage(uploadedImage);
      setDecodedAudio(result.url);
    } catch (err: any) {
      console.error('Decoding error:', err);
      setError(err.message || 'Failed to decode audio from image');
    } finally {
      setIsDecoding(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownloadAudio = () => {
    if (!decodedAudio) return;

    const link = document.createElement('a');
    link.href = decodedAudio;
    link.download = `zypher-decoded-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Art
              </span>{" "}
              Voice Vault
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Record a voice message, generate AI artwork, and hide your audio inside the image using steganography.
            </p>
          </div>

          {/* Workflow Progress */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
              {[
                { id: 'record', label: 'Record', icon: '🎤' },
                { id: 'generate', label: 'Generate', icon: '🎨' },
                { id: 'encode', label: 'Encode', icon: '🔒' },
                { id: 'complete', label: 'Complete', icon: '✅' }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`px-4 py-2 rounded-md transition-all ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : index < ['record', 'generate', 'encode', 'complete'].indexOf(currentStep)
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background text-muted-foreground'
                    }`}
                  >
                    <span className="mr-2">{step.icon}</span>
                    {step.label}
                  </div>
                  {index < 3 && <div className="w-8 h-0.5 bg-border mx-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Backend Status */}
          {backendAvailable === false && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Python Backend Not Running
                  </div>
                  <div className="text-yellow-800 dark:text-yellow-300">
                    To use steganography features, start the Python backend:
                    <code className="block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded font-mono text-xs">
                      cd backend && python -m app.main
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Banner */}
          <div className="mb-6 p-4 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">
                  AI Generations Remaining: {rateLimit.remaining}/{rateLimit.total}
                </span>
              </div>
              {rateLimit.remaining === 0 && (
                <span className="text-sm text-muted-foreground">
                  Resets in: {getTimeUntilReset()}
                </span>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="space-y-6">
              {/* Step 1: Record Audio */}
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                maxDuration={30}
                maxSize={5 * 1024 * 1024}
              />

              {/* Step 2: Generate AI Art */}
              {currentStep !== 'record' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generate AI Artwork</CardTitle>
                    <CardDescription>
                      Create beautiful artwork to hide your voice message
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <PromptInput
                      value={prompt}
                      onChange={setPrompt}
                      disabled={isGenerating || currentStep === 'complete'}
                    />

                    <StyleSelector
                      styles={ART_STYLES}
                      selectedStyle={selectedStyle}
                      onStyleChange={setSelectedStyle}
                      disabled={isGenerating || currentStep === 'complete'}
                    />

                    {currentStep === 'generate' && (
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || rateLimit.remaining === 0 || !prompt.trim()}
                        size="lg"
                        className="w-full"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Artwork'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {isGenerating && <GenerationProgress isGenerating={isGenerating} />}

              {generatedImage && currentStep === 'encode' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Artwork</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                    </div>

                    <Button
                      onClick={handleEncode}
                      disabled={isEncoding || !backendAvailable}
                      size="lg"
                      className="w-full"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isEncoding ? 'Encoding...' : 'Hide Voice Message in Artwork'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isEncoding && (
                <Card className="border-2 border-primary">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">🔒</div>
                      <div className="font-semibold">Hiding Your Voice Message</div>
                      <div className="text-sm text-muted-foreground">
                        Using LSB steganography to embed audio in image pixels...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {encodedImage && currentStep === 'complete' && (
                <Card className="border-2 border-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-500" />
                      Secret Artwork Created!
                    </CardTitle>
                    <CardDescription>
                      Your voice message is now hidden inside this beautiful artwork
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                      <img src={encodedImage} alt="Encoded" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownloadImage(encodedImage, `zypher-secret-${Date.now()}.png`)}
                        size="lg"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Secret Image
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-sm space-y-2">
                        <div className="font-semibold text-green-900 dark:text-green-200">
                          ✓ Success! Your voice message is hidden
                        </div>
                        <div className="text-green-800 dark:text-green-300">
                          Share this image anywhere - only those with Zypher can extract the hidden audio.
                          The image looks normal but contains your secret voice message!
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleReset} variant="outline" className="w-full">
                      Create Another
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!isGenerating && !generatedImage && !encodedImage && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Follow the Workflow</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {currentStep === 'record' && "Record or upload audio to begin"}
                      {currentStep === 'generate' && "Generate AI artwork for your voice message"}
                      {currentStep === 'encode' && "Encode your audio into the artwork"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decode Section */}
      <div className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
                Extract Hidden Audio
              </span>
            </h2>
            <p className="text-muted-foreground">
              Upload an encoded image to reveal and play the hidden voice message
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Encoded Image</CardTitle>
                <CardDescription>
                  Choose an image that contains a hidden audio message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {uploadedImagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedImagePreview(null);
                          setDecodedAudio(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">PNG or JPEG format</p>
                    </label>
                  )}
                </div>

                <Button
                  onClick={handleDecode}
                  disabled={!uploadedImage || isDecoding || !backendAvailable}
                  size="lg"
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isDecoding ? 'Extracting Audio...' : 'Extract Hidden Audio'}
                </Button>
              </CardContent>
            </Card>

            {/* Decode Result Section */}
            <div className="space-y-6">
              {isDecoding && (
                <Card className="border-2 border-primary">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">🔓</div>
                      <div className="font-semibold">Extracting Hidden Audio</div>
                      <div className="text-sm text-muted-foreground">
                        Reading steganographic data from image pixels...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {decodedAudio && (
                <Card className="border-2 border-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-500" />
                      Audio Extracted Successfully!
                    </CardTitle>
                    <CardDescription>
                      The hidden voice message has been revealed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-6">
                      <audio
                        ref={audioRef}
                        src={decodedAudio}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          onClick={togglePlayPause}
                          size="lg"
                          variant="default"
                          className="w-full"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-5 h-5 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 mr-2" />
                              Play Audio
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleDownloadAudio}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Audio
                    </Button>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-sm space-y-2">
                        <div className="font-semibold text-green-900 dark:text-green-200">
                          ✓ Decoding successful!
                        </div>
                        <div className="text-green-800 dark:text-green-300">
                          The secret voice message was hidden using LSB steganography and has been successfully extracted.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isDecoding && !decodedAudio && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Volume2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No Audio Extracted Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload an encoded image to extract and play the hidden audio message
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
