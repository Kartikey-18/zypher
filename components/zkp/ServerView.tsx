"use client";

import { Server, Shield, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServerViewProps {
  data: any;
  isZKP: boolean;
}

export default function ServerView({ data, isZKP }: ServerViewProps) {
  const hasPasswordExposed = data && 'password' in data;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server View
          </CardTitle>
          {data && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              hasPasswordExposed
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {hasPasswordExposed ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Password Exposed
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Password Hidden
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-auto">
          {!data ? (
            <div className="text-gray-500 font-mono text-sm">
              No request received yet...
            </div>
          ) : (
            <div className="space-y-3">
              {/* Request Header */}
              <div className="text-purple-400 font-mono text-sm">
                POST /api/auth/login HTTP/1.1
              </div>
              <div className="text-gray-500 font-mono text-xs">
                Host: api.zypher.app
                <br />
                Content-Type: application/json
                <br />
                User-Agent: Zypher/1.0
              </div>

              <div className="border-t border-gray-700 pt-3">
                <div className="text-gray-400 font-mono text-xs mb-2">
                  Request Body:
                </div>
                <pre className="text-sm font-mono text-green-400 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              {/* Security Warning */}
              {hasPasswordExposed && (
                <div className="border-l-4 border-red-500 bg-red-900/20 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold text-red-400 mb-1">
                        Security Risk!
                      </div>
                      <div className="text-red-300 text-xs">
                        The password "{data.password}" is visible to the server, network
                        administrators, and anyone intercepting this request. If the database
                        is breached, all passwords are compromised.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ZKP Success */}
              {!hasPasswordExposed && isZKP && (
                <div className="border-l-4 border-green-500 bg-green-900/20 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold text-green-400 mb-1">
                        Zero-Knowledge Proof!
                      </div>
                      <div className="text-green-300 text-xs">
                        The server receives only a cryptographic proof. The password never
                        leaves the client. Even if this request is intercepted or the database
                        is breached, the password remains secret.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
