"use client";

import { useState } from "react";
import { ArrowLeft, Info, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConsoleOutput, { ConsoleLog } from "@/components/zkp/ConsoleOutput";
import ServerView from "@/components/zkp/ServerView";
import {
  generateZKProof,
  generateTraditionalAuth,
  hashPasswordToBigInt
} from "@/lib/zkp/zkp-simulator";

export default function ZKPTheaterPage() {
  const [isZKPMode, setIsZKPMode] = useState(true);
  const [username, setUsername] = useState("demo_user");
  const [password, setPassword] = useState("SecurePass123!");
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [serverData, setServerData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addLog = (message: string, type: ConsoleLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setServerData(null);
  };

  const handleGenerateProof = async () => {
    if (!username || !password) {
      addLog('Error: Username and password required', 'error');
      return;
    }

    setIsGenerating(true);
    clearLogs();

    try {
      if (isZKPMode) {
        // ZKP Mode
        addLog('Starting Zero-Knowledge Proof generation...', 'info');
        addLog(`Username: ${username}`, 'info');
        addLog(`Password: ${'*'.repeat(password.length)} (hidden from logs)`, 'info');
        addLog('', 'info');

        const result = await generateZKProof(username, password, (step) => {
          addLog(step, 'info');
        });

        addLog('', 'success');
        addLog('Proof generation complete!', 'success');
        addLog('', 'info');
        addLog('Sending to server...', 'info');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const payload = {
          username,
          proof: result.proof,
          publicSignals: result.publicSignals
        };

        setServerData(payload);
        addLog('✓ Request sent successfully', 'success');
        addLog('✓ Server verified proof without seeing password!', 'success');

      } else {
        // Traditional Mode
        addLog('Traditional authentication mode', 'warning');
        addLog(`Username: ${username}`, 'info');
        addLog(`Password: ${password}`, 'warning');
        addLog('⚠ WARNING: Password sent in plaintext!', 'warning');
        addLog('', 'info');

        // Simulate hashing
        addLog('Hashing password on client...', 'info');
        await new Promise(resolve => setTimeout(resolve, 300));

        const hash = await hashPasswordToBigInt(password);
        addLog(`Hash: ${hash.substring(0, 20)}...`, 'info');
        addLog('', 'info');
        addLog('Sending credentials to server...', 'warning');

        await new Promise(resolve => setTimeout(resolve, 500));

        const payload = generateTraditionalAuth(username, password);
        setServerData(payload);

        addLog('✓ Request sent', 'success');
        addLog('⚠ Password exposed to server!', 'warning');
      }
    } catch (error) {
      addLog(`Error: ${error}`, 'error');
    } finally {
      setIsGenerating(false);
    }
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
                Zero-Knowledge Proof
              </span>{" "}
              Login Theater
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch the difference between traditional and ZKP authentication in real-time.
              Your password never leaves your browser with ZKP!
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border p-1 bg-muted">
              <button
                onClick={() => {
                  setIsZKPMode(false);
                  clearLogs();
                }}
                className={`px-6 py-2 rounded-md transition-all flex items-center gap-2 ${
                  !isZKPMode
                    ? 'bg-background shadow-sm'
                    : 'hover:bg-background/50'
                }`}
              >
                <Unlock className="w-4 h-4" />
                Traditional Auth
              </button>
              <button
                onClick={() => {
                  setIsZKPMode(true);
                  clearLogs();
                }}
                className={`px-6 py-2 rounded-md transition-all flex items-center gap-2 ${
                  isZKPMode
                    ? 'bg-background shadow-sm'
                    : 'hover:bg-background/50'
                }`}
              >
                <Lock className="w-4 h-4" />
                Zero-Knowledge Proof
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className={`mb-8 p-4 rounded-lg border-l-4 ${
            isZKPMode
              ? 'bg-green-50 border-green-500 dark:bg-green-900/10'
              : 'bg-orange-50 border-orange-500 dark:bg-orange-900/10'
          }`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isZKPMode ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
              }`} />
              <div className="text-sm">
                <div className={`font-semibold mb-1 ${
                  isZKPMode ? 'text-green-900 dark:text-green-300' : 'text-orange-900 dark:text-orange-300'
                }`}>
                  {isZKPMode ? 'Zero-Knowledge Proof Mode' : 'Traditional Authentication Mode'}
                </div>
                <div className={isZKPMode ? 'text-green-800 dark:text-green-400' : 'text-orange-800 dark:text-orange-400'}>
                  {isZKPMode
                    ? 'Your password is hashed and used to generate a cryptographic proof. The server can verify you know the password without ever seeing it.'
                    : 'Your password is sent directly to the server. This is how most websites work, making passwords vulnerable to interception and database breaches.'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Left Panel - Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>Login Credentials</CardTitle>
                <CardDescription>
                  Enter your credentials and click Generate to see how they're transmitted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleGenerateProof}
                    disabled={isGenerating}
                    className="flex-1"
                    size="lg"
                  >
                    {isGenerating
                      ? (isZKPMode ? 'Generating Proof...' : 'Authenticating...')
                      : (isZKPMode ? 'Generate Proof' : 'Login (Traditional)')
                    }
                  </Button>
                  <Button
                    onClick={clearLogs}
                    disabled={isGenerating}
                    variant="outline"
                    size="lg"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Server View */}
            <ServerView data={serverData} isZKP={isZKPMode} />
          </div>

          {/* Console Output */}
          <ConsoleOutput logs={logs} title={isZKPMode ? "ZKP Generation Console" : "Authentication Console"} />

          {/* Educational Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How ZKP Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">1.</span>
                  <div>
                    <strong className="text-foreground">Hash Password:</strong> Your password is
                    hashed using SHA-256 on your device
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">2.</span>
                  <div>
                    <strong className="text-foreground">Generate Proof:</strong> A cryptographic
                    circuit creates a proof that you know the password
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">3.</span>
                  <div>
                    <strong className="text-foreground">Send Proof:</strong> Only the proof and
                    password hash are sent to the server
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">4.</span>
                  <div>
                    <strong className="text-foreground">Verify:</strong> Server verifies the proof
                    without ever seeing your password
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits of ZKP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <strong className="text-foreground">No Password Transmission:</strong> Your
                    password never leaves your device
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <strong className="text-foreground">Database Breach Protection:</strong> Even
                    if the server is hacked, passwords stay safe
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <strong className="text-foreground">No Man-in-the-Middle:</strong> Intercepted
                    proofs can't reveal the password
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <strong className="text-foreground">Privacy Preserving:</strong> Prove
                    authentication without revealing sensitive data
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
