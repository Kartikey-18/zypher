"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export interface ConsoleLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  title?: string;
}

export default function ConsoleOutput({ logs, title = "console.log" }: ConsoleOutputProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  const getLogPrefix = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'success':
        return '>';
      case 'warning':
        return '!';
      case 'error':
        return 'x';
      default:
        return '$';
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[var(--color-border-subtle)] overflow-hidden">
      {/* Console Header */}
      <div className="bg-[#111] px-4 py-2 border-b border-[rgba(255,255,255,0.1)] flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 ml-3">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      </div>

      {/* Console Content */}
      <div className="min-h-[300px] max-h-[500px] p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center">
            <span className="text-gray-500">$ waiting for input...</span>
            <span className="terminal-cursor" />
          </div>
        ) : (
          <>
            {logs.map((log, index) => (
              <div
                key={index}
                className={`console-line mb-1 ${getLogColor(log.type)}`}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <span className="text-gray-600">[{log.timestamp}]</span>{' '}
                <span className={`mr-1 ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  log.type === 'error' ? 'text-red-400' :
                  'text-cyan-400'
                }`}>{getLogPrefix(log.type)}</span>
                {log.message}
              </div>
            ))}
            <div className="flex items-center mt-2">
              <span className="text-cyan-400">$</span>
              <span className="terminal-cursor" />
            </div>
          </>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
