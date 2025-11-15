"use client";

import { useEffect, useRef } from "react";

interface WaveformProps {
  audioUrl?: string;
  isRecording?: boolean;
  height?: number;
  className?: string;
}

export default function Waveform({
  audioUrl,
  isRecording = false,
  height = 100,
  className = ""
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (isRecording) {
      drawRecordingWaveform(ctx, rect.width, rect.height);
    } else if (audioUrl) {
      drawStaticWaveform(ctx, rect.width, rect.height);
    } else {
      drawPlaceholder(ctx, rect.width, rect.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl, isRecording]);

  const drawRecordingWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bars = 50;
    const barWidth = width / bars;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'hsl(262.1, 83.3%, 57.8%)'; // primary color

      for (let i = 0; i < bars; i++) {
        // Create animated wave effect
        const amplitude = Math.sin((frame + i) * 0.1) * 0.5 + 0.5;
        const barHeight = amplitude * height * 0.8;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const drawStaticWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bars = 50;
    const barWidth = width / bars;

    ctx.fillStyle = 'hsl(142.1, 76.2%, 36.3%)'; // accent color

    for (let i = 0; i < bars; i++) {
      // Create random-looking but consistent waveform
      const seed = i * 0.5;
      const amplitude = Math.abs(Math.sin(seed) * Math.cos(seed * 1.5)) * 0.8;
      const barHeight = amplitude * height;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'hsl(214.3, 31.8%, 91.4%)'; // border color
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Draw centerline
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw border
    ctx.setLineDash([]);
    ctx.strokeRect(0, 0, width, height);

    // Draw text
    ctx.fillStyle = 'hsl(215.4, 16.3%, 46.9%)'; // muted-foreground
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('No audio recorded', width / 2, height / 2 - 10);
    ctx.font = '12px system-ui';
    ctx.fillText('Click record to start', width / 2, height / 2 + 10);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`w-full rounded-lg ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}
