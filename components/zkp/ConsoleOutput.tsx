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

export default function ConsoleOutput({ logs, title = "Console Output" }: ConsoleOutputProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs added
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
        return 'text-green-400';
    }
  };

  const getLogPrefix = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      default:
        return '›';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-black">
      {/* Console Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm text-gray-300 font-mono">{title}</span>
        <div className="ml-auto flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Console Content */}
      <div className="console-output min-h-[300px] max-h-[500px] p-4 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500 font-mono text-sm">
            Waiting for input...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`console-line font-mono text-sm mb-1 ${getLogColor(log.type)}`}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              <span className="text-gray-600">[{log.timestamp}]</span>{' '}
              <span className="mr-2">{getLogPrefix(log.type)}</span>
              {log.message}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
