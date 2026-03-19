"use client";

import { ArtStyle } from "@/lib/ai/styles";

interface StyleSelectorProps {
  styles: ArtStyle[];
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  disabled?: boolean;
}

export default function StyleSelector({
  styles,
  selectedStyle,
  onStyleChange,
  disabled = false
}: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Art Style</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              selectedStyle === style.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-2xl mb-1">{style.emoji}</div>
            <div className="font-semibold text-xs">{style.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
