"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Info, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StyleSelector from "@/components/ai/StyleSelector";
import PromptInput from "@/components/ai/PromptInput";
import GenerationProgress from "@/components/ai/GenerationProgress";
import { ART_STYLES } from "@/lib/ai/styles";
import { checkRateLimit, incrementRateLimit, getTimeUntilReset, RateLimitInfo } from "@/lib/ai/rate-limiter";

export default function AIArtVaultPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({ remaining: 5, total: 5 });

  useEffect(() => {
    // Check rate limit on mount
    setRateLimit(checkRateLimit());
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    // Check rate limit
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

      // Update rate limit
      const newLimit = incrementRateLimit();
      setRateLimit(newLimit);

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `zypher-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
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
              Generate stunning AI artwork using Stable Diffusion. Later, you'll be able to hide
              secret voice messages inside these images using steganography.
            </p>
          </div>

          {/* Rate Limit Banner */}
          <div className="mb-6 p-4 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">
                  Generations Remaining: {rateLimit.remaining}/{rateLimit.total}
                </span>
              </div>
              {rateLimit.remaining === 0 && (
                <span className="text-sm text-muted-foreground">
                  Resets in: {getTimeUntilReset()}
                </span>
              )}
            </div>
            {rateLimit.remaining <= 2 && rateLimit.remaining > 0 && (
              <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ You're running low on generations. Use them wisely!
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Generation Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Artwork</CardTitle>
                  <CardDescription>
                    Describe what you want to see and choose an artistic style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    disabled={isGenerating}
                  />

                  <StyleSelector
                    styles={ART_STYLES}
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                    disabled={isGenerating}
                  />

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || rateLimit.remaining === 0 || !prompt.trim()}
                    size="lg"
                    className="w-full"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Artwork'}
                  </Button>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">1.</span>
                    <div>
                      <strong className="text-foreground">Describe:</strong> Write what you want to see
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">2.</span>
                    <div>
                      <strong className="text-foreground">Choose Style:</strong> Select an artistic style
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">3.</span>
                    <div>
                      <strong className="text-foreground">Generate:</strong> AI creates your artwork
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground">4.</span>
                    <div>
                      <strong className="text-foreground">Coming Soon:</strong> Hide voice messages in your art
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {isGenerating && <GenerationProgress isGenerating={isGenerating} />}

              {generatedImage && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Your Artwork</CardTitle>
                      <Button onClick={handleDownload} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={generatedImage}
                        alt="Generated artwork"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {metadata && (
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="font-semibold mb-1">Prompt:</div>
                          <div className="text-muted-foreground">{metadata.prompt}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-muted rounded text-center">
                            <div className="text-xs text-muted-foreground">Style</div>
                            <div className="font-semibold capitalize">{metadata.style}</div>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <div className="text-xs text-muted-foreground">Generation Time</div>
                            <div className="font-semibold">{(metadata.generationTime / 1000).toFixed(1)}s</div>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <div className="text-xs text-muted-foreground">Dimensions</div>
                            <div className="font-semibold">{metadata.width}×{metadata.height}</div>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <div className="text-xs text-muted-foreground">Model</div>
                            <div className="font-semibold text-xs">SD 2.1</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {!isGenerating && !generatedImage && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Ready to Create?</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Enter a prompt and choose a style, then click Generate to create your AI artwork.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Coming Soon Banner */}
          <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-dashed border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">🎤 Voice Messages Coming Soon!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                In Phase 4, you'll be able to record voice messages and hide them inside your AI-generated
                artwork using advanced steganography. Share secret messages through beautiful art!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
