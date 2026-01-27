"use client";

import { Server, Shield, ShieldAlert } from "lucide-react";

interface ServerViewProps {
  data: any;
  isZKP: boolean;
}

export default function ServerView({ data, isZKP }: ServerViewProps) {
  const hasPasswordExposed = data && 'password' in data;

  return (
    <div className="bg-[#0a0a0a] border border-[var(--color-border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.1)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">Server View</span>
        </div>
        {data && (
          <div className={`flex items-center gap-2 px-3 py-1 text-xs ${
            hasPasswordExposed
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-green-500/10 border border-green-500/30 text-green-400'
          }`}>
            {hasPasswordExposed ? (
              <>
                <ShieldAlert className="w-3 h-3" />
                EXPOSED
              </>
            ) : (
              <>
                <Shield className="w-3 h-3" />
                SECURE
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 min-h-[300px] max-h-[500px] overflow-auto font-mono text-sm">
        {!data ? (
          <div className="text-gray-500">
            $ waiting for request...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Request Header */}
            <div>
              <div className="text-purple-400">
                POST /api/auth/login HTTP/1.1
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Host: api.zypher.app<br />
                Content-Type: application/json<br />
                User-Agent: Zypher/1.0
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
              <div className="text-gray-500 text-xs mb-2">
                // Request Body:
              </div>
              <pre className="text-green-400 overflow-x-auto text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>

            {/* Security Warning */}
            {hasPasswordExposed && (
              <div className="border-l-2 border-red-400 bg-red-500/10 p-3">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-400 text-xs mb-1">
                      SECURITY_RISK
                    </div>
                    <div className="text-gray-400 text-xs">
                      The password &quot;{data.password}&quot; is visible to the server, network
                      administrators, and anyone intercepting this request.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ZKP Success */}
            {!hasPasswordExposed && isZKP && (
              <div className="border-l-2 border-green-400 bg-green-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-400 text-xs mb-1">
                      ZK_PROOF_VERIFIED
                    </div>
                    <div className="text-gray-400 text-xs">
                      The server receives only a cryptographic proof. The password never
                      leaves the client. Even if this request is intercepted, the password remains secret.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
