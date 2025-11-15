"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  isGenerating: boolean;
  estimatedTime?: number;
}

const PROGRESS_STEPS = [
  { percent: 0, message: "Initializing AI model..." },
  { percent: 20, message: "Processing your prompt..." },
  { percent: 40, message: "Generating latent space..." },
  { percent: 60, message: "Running diffusion steps..." },
  { percent: 80, message: "Refining details..." },
  { percent: 95, message: "Finalizing artwork..." },
  { percent: 100, message: "Complete!" }
];

export default function GenerationProgress({
  isGenerating,
  estimatedTime = 15000
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    // Simulate progress
    const stepDuration = estimatedTime / PROGRESS_STEPS.length;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      if (step < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[step].percent);
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isGenerating, estimatedTime]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <div className="font-semibold">Generating Your Artwork</div>
          <div className="text-sm text-muted-foreground">
            This may take 15-30 seconds...
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{PROGRESS_STEPS[currentStep]?.message}</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <span className="font-semibold">Did you know?</span> Stable Diffusion uses a
        process called "diffusion" that gradually transforms random noise into your
        artwork by following your text prompt.
      </div>
    </div>
  );
}
