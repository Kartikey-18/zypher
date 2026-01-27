"use client";

import { useState } from "react";
import { ArrowLeft, Info, Lock, Unlock, Terminal, Shield, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import ConsoleOutput, { ConsoleLog } from "@/components/zkp/ConsoleOutput";
import ServerView from "@/components/zkp/ServerView";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  generateZKProof,
  generateTraditionalAuth,
  hashPasswordToBigInt
} from "@/lib/zkp/zkp-simulator";

export default function ZKPTheaterPage() {
  const [isZKPMode, setIsZKPMode] = useState(true);
  const [username, setUsername] = useState("demo_user");
  const [password, setPassword] = useState("SecurePass123!");
  const [showPassword, setShowPassword] = useState(false);
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
        addLog('Initializing Zero-Knowledge Proof generation...', 'info');
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

        await new Promise(resolve => setTimeout(resolve, 500));

        const payload = {
          username,
          proof: result.proof,
          publicSignals: result.publicSignals
        };

        setServerData(payload);
        addLog('> Request sent successfully', 'success');
        addLog('> Server verified proof without seeing password!', 'success');

      } else {
        addLog('Traditional authentication mode', 'warning');
        addLog(`Username: ${username}`, 'info');
        addLog(`Password: ${password}`, 'warning');
        addLog('! WARNING: Password sent in plaintext!', 'warning');
        addLog('', 'info');

        addLog('Hashing password on client...', 'info');
        await new Promise(resolve => setTimeout(resolve, 300));

        const hash = await hashPasswordToBigInt(password);
        addLog(`Hash: ${hash.substring(0, 20)}...`, 'info');
        addLog('', 'info');
        addLog('Sending credentials to server...', 'warning');

        await new Promise(resolve => setTimeout(resolve, 500));

        const payload = generateTraditionalAuth(username, password);
        setServerData(payload);

        addLog('> Request sent', 'success');
        addLog('! Password exposed to server!', 'warning');
      }
    } catch (error) {
      addLog(`Error: ${error}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface-primary)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border-subtle)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            cd ../
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--color-cyan)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">ZKP_THEATER</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-muted)]">// </span>
              <span className="text-[var(--color-cyan)]">Zero-Knowledge Proof</span>
              <span className="text-[var(--color-text-primary)]"> Login Theater</span>
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm max-w-2xl mx-auto">
              Watch the difference between traditional and ZKP authentication in real-time.
              Your password never leaves your browser with ZKP!
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] p-1">
              <button
                onClick={() => {
                  setIsZKPMode(false);
                  clearLogs();
                }}
                className={`px-6 py-2 transition-all flex items-center gap-2 text-sm ${
                  !isZKPMode
                    ? 'bg-[var(--color-surface-interactive)] text-orange-500 border border-orange-400/30'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
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
                className={`px-6 py-2 transition-all flex items-center gap-2 text-sm ${
                  isZKPMode
                    ? 'bg-[var(--color-surface-interactive)] text-[var(--color-green)] border border-green-400/30'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Lock className="w-4 h-4" />
                Zero-Knowledge Proof
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className={`mb-8 p-4 border-l-2 ${
            isZKPMode
              ? 'bg-green-500/10 border-[var(--color-green)]'
              : 'bg-orange-500/10 border-orange-500'
          }`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isZKPMode ? 'text-[var(--color-green)]' : 'text-orange-500'
              }`} />
              <div className="text-sm">
                <div className={`font-semibold mb-1 ${
                  isZKPMode ? 'text-[var(--color-green)]' : 'text-orange-500'
                }`}>
                  {isZKPMode ? 'Zero-Knowledge Proof Mode' : 'Traditional Authentication Mode'}
                </div>
                <div className="text-[var(--color-text-secondary)]">
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
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="border-b border-[var(--color-border-subtle)] px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Login Credentials</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs text-[var(--color-text-muted)] mb-2 block uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isGenerating}
                    className="w-full bg-[var(--color-surface-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-[var(--color-text-primary)] text-sm focus:border-[var(--color-cyan)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--color-text-muted)] mb-2 block uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      disabled={isGenerating}
                      className="w-full bg-[var(--color-surface-primary)] border border-[var(--color-border-subtle)] px-4 py-3 text-[var(--color-text-primary)] text-sm focus:border-[var(--color-cyan)] focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleGenerateProof}
                    disabled={isGenerating}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${
                      isZKPMode
                        ? 'bg-green-500/10 border border-green-500/50 text-[var(--color-green)] hover:bg-green-500/20'
                        : 'bg-orange-500/10 border border-orange-500/50 text-orange-500 hover:bg-orange-500/20'
                    } disabled:opacity-50`}
                  >
                    {isGenerating
                      ? (isZKPMode ? 'Generating Proof...' : 'Authenticating...')
                      : (isZKPMode ? './generate_proof.sh' : './login_traditional.sh')
                    }
                  </button>
                  <button
                    onClick={clearLogs}
                    disabled={isGenerating}
                    className="px-4 py-3 text-sm border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-all disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Server View */}
            <ServerView data={serverData} isZKP={isZKPMode} />
          </div>

          {/* Console Output */}
          <ConsoleOutput logs={logs} title={isZKPMode ? "zkp_generation.log" : "auth.log"} />

          {/* Educational Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
                <span className="text-sm text-[var(--color-cyan)]">// HOW ZKP WORKS</span>
              </div>
              <div className="p-6 space-y-4 text-sm">
                {[
                  { step: "01", title: "Hash Password", desc: "Your password is hashed using SHA-256 on your device" },
                  { step: "02", title: "Generate Proof", desc: "A cryptographic circuit creates a proof that you know the password" },
                  { step: "03", title: "Send Proof", desc: "Only the proof and password hash are sent to the server" },
                  { step: "04", title: "Verify", desc: "Server verifies the proof without ever seeing your password" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 bg-[color-mix(in_srgb,var(--color-cyan)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-cyan)_50%,transparent)] flex items-center justify-center text-[var(--color-cyan)] text-xs flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-[var(--color-text-primary)] font-medium">{item.title}</div>
                      <div className="text-[var(--color-text-muted)]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
                <span className="text-sm text-[var(--color-green)]">// BENEFITS OF ZKP</span>
              </div>
              <div className="p-6 space-y-4 text-sm">
                {[
                  { title: "No Password Transmission", desc: "Your password never leaves your device" },
                  { title: "Database Breach Protection", desc: "Even if the server is hacked, passwords stay safe" },
                  { title: "No Man-in-the-Middle", desc: "Intercepted proofs can't reveal the password" },
                  { title: "Privacy Preserving", desc: "Prove authentication without revealing sensitive data" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[var(--color-green)] mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-[var(--color-text-primary)] font-medium">{item.title}</div>
                      <div className="text-[var(--color-text-muted)]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-muted)]">// </span>
              ARCHITECTURE COMPARISON
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Traditional Authentication Flow */}
              <div className="bg-orange-500/10 border border-orange-500/30">
                <div className="border-b border-orange-500/30 px-4 py-3 flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-500">Traditional Authentication</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Client */}
                    <div className="w-full p-4 bg-[var(--color-surface-primary)] border border-orange-500/30">
                      <div className="font-semibold text-center mb-2 text-[var(--color-text-primary)]">Client (Browser)</div>
                      <div className="text-sm text-[var(--color-text-muted)] text-center font-mono">
                        username: &quot;demo_user&quot;<br />
                        password: &quot;SecurePass123!&quot;
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      <div className="text-orange-500 font-mono text-xs">HTTPS</div>
                      <div className="w-0.5 h-6 bg-orange-500/50"></div>
                      <div className="text-xs bg-orange-500/20 text-orange-500 px-2 py-1 border border-orange-500/30">
                        username + password
                      </div>
                      <div className="w-0.5 h-6 bg-orange-500/50"></div>
                      <div className="text-orange-500">▼</div>
                    </div>

                    {/* Server */}
                    <div className="w-full p-4 bg-[var(--color-surface-primary)] border border-orange-500/30">
                      <div className="font-semibold text-center mb-2 text-[var(--color-text-primary)]">Server</div>
                      <div className="text-sm text-[var(--color-text-muted)] text-center">
                        Receives plaintext password<br />
                        Hashes & compares with DB
                      </div>
                    </div>

                    {/* Vulnerabilities */}
                    <div className="w-full p-3 bg-orange-500/10 border border-orange-500/30">
                      <div className="text-xs font-semibold text-orange-500 mb-2">VULNERABILITIES:</div>
                      <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                        <li>- Password exposed in transit</li>
                        <li>- Server sees plaintext password</li>
                        <li>- DB breach reveals passwords</li>
                        <li>- Man-in-the-middle attacks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* ZKP Authentication Flow */}
              <div className="bg-green-500/10 border border-green-500/30">
                <div className="border-b border-green-500/30 px-4 py-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--color-green)]" />
                  <span className="text-sm text-[var(--color-green)]">Zero-Knowledge Proof</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Client */}
                    <div className="w-full p-4 bg-[var(--color-surface-primary)] border border-green-500/30">
                      <div className="font-semibold text-center mb-2 text-[var(--color-text-primary)]">Client (Browser)</div>
                      <div className="text-sm text-[var(--color-text-muted)] text-center space-y-1">
                        <div className="font-mono">username: &quot;demo_user&quot;</div>
                        <div className="font-mono">password: &quot;SecurePass123!&quot;</div>
                        <div className="text-[var(--color-green)] font-medium pt-1">
                          ↓ SHA-256 Hash<br />
                          ↓ Generate ZK Proof
                        </div>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      <div className="text-[var(--color-green)] font-mono text-xs">HTTPS</div>
                      <div className="w-0.5 h-6 bg-green-500/50"></div>
                      <div className="text-xs bg-green-500/20 text-[var(--color-green)] px-2 py-1 border border-green-500/30 text-center">
                        username + proof + hash<br />
                        <span className="font-bold">(NO PASSWORD)</span>
                      </div>
                      <div className="w-0.5 h-6 bg-green-500/50"></div>
                      <div className="text-[var(--color-green)]">▼</div>
                    </div>

                    {/* Server */}
                    <div className="w-full p-4 bg-[var(--color-surface-primary)] border border-green-500/30">
                      <div className="font-semibold text-center mb-2 text-[var(--color-text-primary)]">Server</div>
                      <div className="text-sm text-[var(--color-text-muted)] text-center">
                        Verifies proof mathematically<br />
                        Never sees actual password
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="w-full p-3 bg-green-500/10 border border-green-500/30">
                      <div className="text-xs font-semibold text-[var(--color-green)] mb-2">SECURITY BENEFITS:</div>
                      <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                        <li>+ Password stays in browser</li>
                        <li>+ Server never sees password</li>
                        <li>+ DB breach safe</li>
                        <li>+ MitM attacks useless</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mt-8 bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
                <span className="text-sm text-[var(--color-purple)]">// TECHNICAL IMPLEMENTATION</span>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-[color-mix(in_srgb,var(--color-purple)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_50%,transparent)] flex items-center justify-center">
                      <span className="font-bold text-[var(--color-purple)]">1</span>
                    </div>
                    <h4 className="font-semibold text-[var(--color-text-primary)]">Password Hashing</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Client-side SHA-256 hashing converts password to a 256-bit hash. This happens entirely in the browser.
                    </p>
                    <code className="text-xs bg-[var(--color-surface-primary)] p-2 block border border-[var(--color-border-subtle)] text-[var(--color-pink)]">
                      hash = SHA256(password)
                    </code>
                  </div>

                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-[color-mix(in_srgb,var(--color-purple)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_50%,transparent)] flex items-center justify-center">
                      <span className="font-bold text-[var(--color-purple)]">2</span>
                    </div>
                    <h4 className="font-semibold text-[var(--color-text-primary)]">Proof Generation</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      snarkjs generates a cryptographic proof using Groth16 protocol that proves knowledge of the password.
                    </p>
                    <code className="text-xs bg-[var(--color-surface-primary)] p-2 block border border-[var(--color-border-subtle)] text-[var(--color-pink)]">
                      proof = zkSNARK(hash, circuit)
                    </code>
                  </div>

                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-[color-mix(in_srgb,var(--color-purple)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_50%,transparent)] flex items-center justify-center">
                      <span className="font-bold text-[var(--color-purple)]">3</span>
                    </div>
                    <h4 className="font-semibold text-[var(--color-text-primary)]">Server Verification</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Server uses verification key to mathematically verify the proof without seeing the password.
                    </p>
                    <code className="text-xs bg-[var(--color-surface-primary)] p-2 block border border-[var(--color-border-subtle)] text-[var(--color-pink)]">
                      verify(proof, publicSignals)
                    </code>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[color-mix(in_srgb,var(--color-cyan)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-cyan)_30%,transparent)]">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-[var(--color-cyan)] mt-0.5" />
                    <div className="text-sm">
                      <strong className="text-[var(--color-cyan)]">Key Insight:</strong>
                      <span className="text-[var(--color-text-secondary)]"> The proof is a mathematical guarantee that the client knows the password,
                      without revealing any information about the password itself. Even quantum computers cannot reverse-engineer
                      the password from the proof.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
