"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Info, Zap, Lock, Image as ImageIcon, Upload, Play, Pause, Volume2, Terminal, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import StyleSelector from "@/components/ai/StyleSelector";
import PromptInput from "@/components/ai/PromptInput";
import GenerationProgress from "@/components/ai/GenerationProgress";
import AudioRecorder from "@/components/audio/AudioRecorder";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

  const steps = [
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'encode', label: 'Encode', icon: Lock },
    { id: 'complete', label: 'Complete', icon: Download }
  ];

  return (
    <main className="min-h-screen bg-[var(--color-surface-primary)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border-subtle)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            cd ../
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--color-purple)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">AI_ART_VAULT</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-muted)]">// </span>
              <span className="text-[var(--color-cyan)]">AI Art</span>
              <span className="text-[var(--color-text-primary)]"> Voice Vault</span>
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm max-w-2xl mx-auto">
              Record a voice message, generate AI artwork, and hide your audio inside the image using steganography.
            </p>
          </div>

          {/* Workflow Progress */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] p-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const stepIndex = steps.findIndex(s => s.id === currentStep);
                const isActive = step.id === currentStep;
                const isCompleted = index < stepIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`px-4 py-2 flex items-center gap-2 text-sm transition-all ${
                        isActive
                          ? 'bg-[color-mix(in_srgb,var(--color-cyan)_20%,transparent)] text-[var(--color-cyan)] border border-[color-mix(in_srgb,var(--color-cyan)_30%,transparent)]'
                          : isCompleted
                          ? 'bg-green-500/10 text-[var(--color-green)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {step.label}
                    </div>
                    {index < 3 && (
                      <div className={`w-8 h-0.5 ${
                        isCompleted ? 'bg-green-500/50' : 'bg-[var(--color-border-subtle)]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backend Status */}
          {backendAvailable === false && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 border-l-2 border-l-yellow-500">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-yellow-500 mb-1">
                    BACKEND_NOT_RUNNING
                  </div>
                  <div className="text-[var(--color-text-secondary)]">
                    To use steganography features, start the Python backend:
                  </div>
                  <code className="block mt-2 p-2 bg-[var(--color-surface-primary)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-pink)]">
                    cd backend && python -m app.main
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Banner */}
          <div className="mb-6 p-4 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                AI Generations: <span className="text-[var(--color-text-primary)]">{rateLimit.remaining}/{rateLimit.total}</span>
              </span>
            </div>
            {rateLimit.remaining === 0 && (
              <span className="text-xs text-[var(--color-text-muted)]">
                Resets in: {getTimeUntilReset()}
              </span>
            )}
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
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
                  <div className="border-b border-[var(--color-border-subtle)] px-4 py-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-purple)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Generate AI Artwork</span>
                  </div>
                  <div className="p-6 space-y-6">
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
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || rateLimit.remaining === 0 || !prompt.trim()}
                        className="w-full py-3 text-sm font-medium bg-[color-mix(in_srgb,var(--color-purple)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_50%,transparent)] text-[var(--color-purple)] hover:bg-[color-mix(in_srgb,var(--color-purple)_20%,transparent)] transition-all disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : './generate_artwork.sh'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 border-l-2 border-l-red-500 text-red-500 text-sm">
                  ERROR: {error}
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {isGenerating && <GenerationProgress isGenerating={isGenerating} />}

              {generatedImage && currentStep === 'encode' && (
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
                  <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
                    <span className="text-sm text-[var(--color-text-secondary)]">Generated Artwork</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="relative aspect-square overflow-hidden border border-[var(--color-border-subtle)]">
                      <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                    </div>

                    <button
                      onClick={handleEncode}
                      disabled={isEncoding || !backendAvailable}
                      className="w-full py-3 text-sm font-medium bg-[color-mix(in_srgb,var(--color-cyan)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-cyan)_50%,transparent)] text-[var(--color-cyan)] hover:bg-[color-mix(in_srgb,var(--color-cyan)_20%,transparent)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {isEncoding ? 'Encoding...' : './encode_audio.sh'}
                    </button>
                  </div>
                </div>
              )}

              {isEncoding && (
                <div className="bg-[var(--color-surface-elevated)] border-2 border-[color-mix(in_srgb,var(--color-cyan)_50%,transparent)]">
                  <div className="p-6 text-center space-y-3">
                    <Lock className="w-10 h-10 text-[var(--color-cyan)] mx-auto animate-pulse" />
                    <div className="font-semibold text-[var(--color-text-primary)]">Hiding Your Voice Message</div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      Using LSB steganography to embed audio in image pixels...
                    </div>
                  </div>
                </div>
              )}

              {encodedImage && currentStep === 'complete' && (
                <div className="bg-[var(--color-surface-elevated)] border-2 border-green-500/50">
                  <div className="border-b border-green-500/30 px-4 py-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--color-green)]" />
                    <span className="text-sm text-[var(--color-green)]">SECRET_ARTWORK_CREATED</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="relative aspect-square overflow-hidden border-2 border-green-500/30">
                      <img src={encodedImage} alt="Encoded" className="w-full h-full object-cover" />
                    </div>

                    <button
                      onClick={() => handleDownloadImage(encodedImage, `zypher-secret-${Date.now()}.png`)}
                      className="w-full py-3 text-sm font-medium bg-green-500/10 border border-green-500/50 text-[var(--color-green)] hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Secret Image
                    </button>

                    <div className="p-4 bg-green-500/10 border border-green-500/30">
                      <div className="text-sm space-y-2">
                        <div className="font-semibold text-[var(--color-green)]">
                          &gt; Success! Voice message hidden
                        </div>
                        <div className="text-[var(--color-text-muted)]">
                          Share this image anywhere - only those with Zypher can extract the hidden audio.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full py-3 text-sm border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              )}

              {!isGenerating && !generatedImage && !encodedImage && (
                <div className="bg-[var(--color-surface-elevated)] border border-dashed border-[var(--color-border-default)]">
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] mx-auto flex items-center justify-center mb-4">
                      <ImageIcon className="w-10 h-10 text-[var(--color-text-muted)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Follow the Workflow</h3>
                    <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
                      {currentStep === 'record' && "Record or upload audio to begin"}
                      {currentStep === 'generate' && "Generate AI artwork for your voice message"}
                      {currentStep === 'encode' && "Encode your audio into the artwork"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decode Section */}
      <div className="container mx-auto px-4 py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-muted)]">// </span>
              <span className="text-[var(--color-pink)]">Extract Hidden Audio</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              Upload an encoded image to reveal and play the hidden voice message
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="border-b border-[var(--color-border-subtle)] px-4 py-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[var(--color-pink)]" />
                <span className="text-sm text-[var(--color-text-secondary)]">Upload Encoded Image</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-[var(--color-border-default)] p-8 text-center hover:border-[var(--color-pink)] transition-colors">
                  {uploadedImagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded"
                        className="max-h-64 mx-auto"
                      />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedImagePreview(null);
                          setDecodedAudio(null);
                        }}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Click to upload image</p>
                      <p className="text-xs text-[var(--color-text-muted)]">PNG or JPEG format</p>
                    </label>
                  )}
                </div>

                <button
                  onClick={handleDecode}
                  disabled={!uploadedImage || isDecoding || !backendAvailable}
                  className="w-full py-3 text-sm font-medium bg-[color-mix(in_srgb,var(--color-pink)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-pink)_50%,transparent)] text-[var(--color-pink)] hover:bg-[color-mix(in_srgb,var(--color-pink)_20%,transparent)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {isDecoding ? 'Extracting...' : './decode_audio.sh'}
                </button>
              </div>
            </div>

            {/* Decode Result Section */}
            <div className="space-y-6">
              {isDecoding && (
                <div className="bg-[var(--color-surface-elevated)] border-2 border-[color-mix(in_srgb,var(--color-pink)_50%,transparent)]">
                  <div className="p-6 text-center space-y-3">
                    <Lock className="w-10 h-10 text-[var(--color-pink)] mx-auto animate-pulse" />
                    <div className="font-semibold text-[var(--color-text-primary)]">Extracting Hidden Audio</div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      Reading steganographic data from image pixels...
                    </div>
                  </div>
                </div>
              )}

              {decodedAudio && (
                <div className="bg-[var(--color-surface-elevated)] border-2 border-green-500/50">
                  <div className="border-b border-green-500/30 px-4 py-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[var(--color-green)]" />
                    <span className="text-sm text-[var(--color-green)]">AUDIO_EXTRACTED</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-border-subtle)] p-6">
                      <audio
                        ref={audioRef}
                        src={decodedAudio}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      <button
                        onClick={togglePlayPause}
                        className="w-full py-4 text-sm font-medium bg-green-500/10 border border-green-500/50 text-[var(--color-green)] hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-5 h-5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Play Audio
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleDownloadAudio}
                      className="w-full py-3 text-sm border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Audio
                    </button>

                    <div className="p-4 bg-green-500/10 border border-green-500/30">
                      <div className="text-sm space-y-2">
                        <div className="font-semibold text-[var(--color-green)]">
                          &gt; Decoding successful!
                        </div>
                        <div className="text-[var(--color-text-muted)]">
                          The secret voice message was hidden using LSB steganography and has been successfully extracted.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isDecoding && !decodedAudio && (
                <div className="bg-[var(--color-surface-elevated)] border border-dashed border-[var(--color-border-default)]">
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] mx-auto flex items-center justify-center mb-4">
                      <Volume2 className="w-10 h-10 text-[var(--color-text-muted)]" />
                    </div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">No Audio Extracted Yet</h3>
                    <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
                      Upload an encoded image to extract and play the hidden audio message
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
