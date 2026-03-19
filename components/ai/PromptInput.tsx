"use client";

import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PROMPTS } from "@/lib/ai/styles";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export default function PromptInput({
  value,
  onChange,
  disabled = false,
  maxLength = 500
}: PromptInputProps) {
  const handleRandomPrompt = () => {
    const randomPrompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    onChange(randomPrompt);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Describe Your Artwork</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRandomPrompt}
          disabled={disabled}
        >
          <Shuffle className="w-4 h-4 mr-1" />
          Random
        </Button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Describe the image you want to create... (e.g., 'A serene mountain landscape at sunset with a calm lake')"
          maxLength={maxLength}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        💡 Tip: Be specific and descriptive for better results. Include details about mood, lighting, colors, and composition.
      </div>
    </div>
  );
}
