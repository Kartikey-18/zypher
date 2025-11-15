"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Waveform from "./Waveform";
import { AudioRecorder as Recorder, RecordingResult, validateAudioFile, getAudioDuration } from "@/lib/audio/recorder";

interface AudioRecorderProps {
  onRecordingComplete?: (result: RecordingResult) => void;
  maxDuration?: number;
  maxSize?: number;
}

export default function AudioRecorder({
  onRecordingComplete,
  maxDuration = 30,
  maxSize = 5 * 1024 * 1024 // 5MB
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState<RecordingResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const recorderRef = useRef<Recorder>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check browser support
    if (!Recorder.isSupported()) {
      setError('Audio recording is not supported in your browser');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setError(null);
    setRecordingResult(null);
    setRecordingTime(0);

    try {
      recorderRef.current = new Recorder({ maxDuration });
      await recorderRef.current.start();
      setIsRecording(true);

      // Update recording time
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            handleStopRecording();
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);

    } catch (err: any) {
      setError(err.message || 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      const result = await recorderRef.current.stop();
      setRecordingResult(result);
      setIsRecording(false);
      onRecordingComplete?.(result);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to stop recording');
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !recordingResult) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = () => {
    setRecordingResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateAudioFile(file, maxSize);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Check duration
      const duration = await getAudioDuration(file);
      if (duration > maxDuration) {
        setError(`Audio too long. Maximum: ${maxDuration} seconds`);
        return;
      }

      // Create result
      const url = URL.createObjectURL(file);
      const result: RecordingResult = {
        blob: file,
        url,
        duration,
        size: file.size
      };

      setRecordingResult(result);
      onRecordingComplete?.(result);

    } catch (err: any) {
      setError(err.message || 'Failed to load audio file');
    }
  };

  const handleDownload = () => {
    if (!recordingResult) return;

    const link = document.createElement('a');
    link.href = recordingResult.url;
    link.download = `zypher-recording-${Date.now()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Voice Message</CardTitle>
        <CardDescription>
          Record up to {maxDuration} seconds or upload an audio file (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Waveform Visualization */}
        <Waveform
          audioUrl={recordingResult?.url}
          isRecording={isRecording}
          height={100}
        />

        {/* Time Display */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {isRecording ? 'Recording...' : recordingResult ? 'Recorded' : 'Ready'}
          </span>
          <span className="font-mono">
            {isRecording
              ? formatTime(recordingTime)
              : recordingResult
              ? formatTime(currentTime || recordingResult.duration)
              : '0:00'
            } / {formatTime(maxDuration)}
          </span>
        </div>

        {/* Recording Progress Bar */}
        {isRecording && (
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${(recordingTime / maxDuration) * 100}%` }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!recordingResult && !isRecording && (
            <>
              <Button
                onClick={handleStartRecording}
                className="flex-1"
                size="lg"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </>
          )}

          {isRecording && (
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}

          {recordingResult && !isRecording && (
            <>
              <Button
                onClick={handlePlayPause}
                variant="outline"
                size="lg"
              >
                {isPlaying ? (
                  <><Pause className="w-4 h-4 mr-2" /> Pause</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Play</>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Audio Player */}
        {recordingResult && (
          <audio
            ref={audioRef}
            src={recordingResult.url}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            className="hidden"
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Info */}
        {recordingResult && (
          <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-mono">{formatTime(recordingResult.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-mono">{(recordingResult.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
