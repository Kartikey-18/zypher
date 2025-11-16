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

          {/* Architecture Diagram */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Architecture Comparison
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Traditional Authentication Flow */}
              <Card className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-300">
                    <Unlock className="w-5 h-5" />
                    Traditional Authentication
                  </CardTitle>
                  <CardDescription>Password sent to server</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Client */}
                    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                      <div className="font-semibold text-center mb-2">Client (Browser)</div>
                      <div className="text-sm text-muted-foreground text-center">
                        Username: "demo_user"<br />
                        Password: "SecurePass123!"
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      <div className="text-orange-600 dark:text-orange-400 font-mono text-xs">
                        HTTPS Request
                      </div>
                      <div className="w-0.5 h-8 bg-orange-400"></div>
                      <div className="text-orange-600 dark:text-orange-400 text-xs bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                        username + password
                      </div>
                      <div className="w-0.5 h-8 bg-orange-400"></div>
                    </div>

                    {/* Server */}
                    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                      <div className="font-semibold text-center mb-2">Server</div>
                      <div className="text-sm text-muted-foreground text-center">
                        Receives plaintext password<br />
                        Hashes & compares with DB
                      </div>
                    </div>

                    {/* Vulnerabilities */}
                    <div className="w-full p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-300 dark:border-orange-700">
                      <div className="text-xs font-semibold text-orange-900 dark:text-orange-300 mb-1">
                        Vulnerabilities:
                      </div>
                      <ul className="text-xs text-orange-800 dark:text-orange-400 space-y-1">
                        <li>• Password exposed in transit</li>
                        <li>• Server sees plaintext password</li>
                        <li>• DB breach reveals passwords</li>
                        <li>• Man-in-the-middle attacks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ZKP Authentication Flow */}
              <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-300">
                    <Lock className="w-5 h-5" />
                    Zero-Knowledge Proof
                  </CardTitle>
                  <CardDescription>Password never leaves browser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Client */}
                    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-300 dark:border-green-700">
                      <div className="font-semibold text-center mb-2">Client (Browser)</div>
                      <div className="text-sm text-muted-foreground text-center space-y-1">
                        <div>Username: "demo_user"</div>
                        <div>Password: "SecurePass123!"</div>
                        <div className="text-green-600 dark:text-green-400 font-medium pt-1">
                          ↓ SHA-256 Hash<br />
                          ↓ Generate ZK Proof
                        </div>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      <div className="text-green-600 dark:text-green-400 font-mono text-xs">
                        HTTPS Request
                      </div>
                      <div className="w-0.5 h-8 bg-green-400"></div>
                      <div className="text-green-600 dark:text-green-400 text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-center">
                        username + proof + hash<br />
                        (NO PASSWORD)
                      </div>
                      <div className="w-0.5 h-8 bg-green-400"></div>
                    </div>

                    {/* Server */}
                    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-300 dark:border-green-700">
                      <div className="font-semibold text-center mb-2">Server</div>
                      <div className="text-sm text-muted-foreground text-center">
                        Verifies proof mathematically<br />
                        Never sees actual password
                      </div>
                    </div>

                    {/* Advantages */}
                    <div className="w-full p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                      <div className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1">
                        Security Benefits:
                      </div>
                      <ul className="text-xs text-green-800 dark:text-green-400 space-y-1">
                        <li>• Password stays in browser</li>
                        <li>• Server never sees password</li>
                        <li>• DB breach safe</li>
                        <li>• MitM attacks useless</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Details */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Technical Implementation</CardTitle>
                <CardDescription>How the ZKP system works under the hood</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <h4 className="font-semibold">Password Hashing</h4>
                    <p className="text-sm text-muted-foreground">
                      Client-side SHA-256 hashing converts password to a 256-bit hash. This happens entirely in the browser.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      hash = SHA256(password)
                    </code>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <h4 className="font-semibold">Proof Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      snarkjs generates a cryptographic proof using Groth16 protocol that proves knowledge of the password.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      proof = zkSNARK(hash, circuit)
                    </code>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <h4 className="font-semibold">Server Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Server uses verification key to mathematically verify the proof without seeing the password.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      verify(proof, publicSignals)
                    </code>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <strong>Key Insight:</strong> The proof is a mathematical guarantee that the client knows the password,
                      without revealing any information about the password itself. Even quantum computers cannot reverse-engineer
                      the password from the proof.
                    </div>
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
