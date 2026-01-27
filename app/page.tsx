"use client";

import Link from "next/link"
import { ArrowRight, Lock, Palette, Volume2, Terminal, Shield, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Simple GitHub icon component
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-primary)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border-subtle)] sticky top-0 bg-[var(--color-surface-primary)]/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--color-cyan)]" />
            <span className="text-xl font-bold text-[var(--color-text-primary)]">ZYPHER</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/zkp-theater" className="nav-link text-sm">
              ZKP_DEMO
            </Link>
            <Link href="/ai-art-vault" className="nav-link text-sm">
              AI_ART_VAULT
            </Link>
            <a
              href="https://github.com/Kartikey-18/zypher"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-secondary)]">
            <div className="status-dot status-online" />
            <span>PRIVACY_TECH_DEMO v1.0.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight fade-in-up">
            <span className="text-[var(--color-text-muted)]">&gt;_ </span>
            <span className="text-[var(--color-text-primary)]">ZYPHER</span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto fade-in-up stagger-1">
            Experience cutting-edge privacy technologies through interactive demonstrations:
            <span className="text-[var(--color-cyan)]"> Zero-Knowledge Proofs</span>,
            <span className="text-[var(--color-purple)]"> AI-Generated Art</span>, and
            <span className="text-[var(--color-pink)]"> Audio Steganography</span>.
          </p>

          <div className="flex gap-4 justify-center pt-6 fade-in-up stagger-2">
            <Link
              href="/zkp-theater"
              className="btn-primary-glow inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
            >
              ./run_demos.sh <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Kartikey-18/zypher"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terminal inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
            >
              <GithubIcon className="w-4 h-4" /> View Source
            </a>
          </div>

          {/* Terminal-style command preview */}
          <div className="max-w-xl mx-auto mt-12 fade-in-up stagger-3">
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-secondary)] border-b border-[var(--color-border-subtle)]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-[var(--color-text-muted)]">terminal</span>
              </div>
              <div className="p-4 text-left text-sm">
                <div className="text-[var(--color-text-muted)]">$ zypher --help</div>
                <div className="mt-2 text-[var(--color-green)]">
                  <span className="text-[var(--color-cyan)]">ZYPHER</span> - Privacy Technology Platform
                </div>
                <div className="mt-2 text-[var(--color-text-secondary)]">
                  <div>COMMANDS:</div>
                  <div className="ml-4 mt-1 text-[var(--color-text-muted)]">
                    <div><span className="text-[var(--color-yellow)]">zkp</span>      Zero-Knowledge Proof authentication</div>
                    <div><span className="text-[var(--color-yellow)]">generate</span> AI artwork generation</div>
                    <div><span className="text-[var(--color-yellow)]">encode</span>   Hide audio in images</div>
                    <div><span className="text-[var(--color-yellow)]">decode</span>   Extract hidden audio</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-[var(--color-text-muted)]">$ </span>
                  <span className="terminal-cursor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            <span className="text-[var(--color-text-muted)]">// </span>
            TECHNOLOGIES
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            Three privacy-preserving technologies working together
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* ZKP Card */}
          <div className="feature-card p-6 fade-in-up">
            <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-cyan)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-cyan)_30%,transparent)] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[var(--color-cyan)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Authenticate without revealing your password. The server verifies you know the secret
              without ever seeing it.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tech-badge">snarkjs</span>
              <span className="tech-badge">SHA-256</span>
              <span className="tech-badge">Groth16</span>
            </div>
            <Link
              href="/zkp-theater"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-cyan)] hover:opacity-80 transition-opacity"
            >
              ./zkp_demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Art Card */}
          <div className="feature-card p-6 fade-in-up stagger-1">
            <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-purple)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_30%,transparent)] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[var(--color-purple)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">AI Art Generation</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Create stunning artwork using FLUX. Choose from multiple artistic styles
              to generate unique images.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tech-badge">FLUX</span>
              <span className="tech-badge">Hugging Face</span>
              <span className="tech-badge">1024x1024</span>
            </div>
            <Link
              href="/ai-art-vault"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-purple)] hover:opacity-80 transition-opacity"
            >
              ./generate_art <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Steganography Card */}
          <div className="feature-card p-6 fade-in-up stagger-2">
            <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-pink)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-pink)_30%,transparent)] flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-[var(--color-pink)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Audio Steganography</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Hide voice messages inside AI-generated images using LSB encoding.
              Share secrets through beautiful art.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tech-badge">LSB</span>
              <span className="tech-badge">WAV</span>
              <span className="tech-badge">Lossless</span>
            </div>
            <Link
              href="/ai-art-vault"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-pink)] hover:opacity-80 transition-opacity"
            >
              ./encode_audio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              <span className="text-[var(--color-text-muted)]">// </span>
              HOW IT WORKS
            </h2>
          </div>

          <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[color-mix(in_srgb,var(--color-cyan)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-cyan)_50%,transparent)] flex items-center justify-center text-[var(--color-cyan)] text-sm font-bold">
                    01
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Record Audio</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] pl-11">
                  Capture your voice message using the browser&apos;s microphone (up to 30 seconds).
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[color-mix(in_srgb,var(--color-purple)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-purple)_50%,transparent)] flex items-center justify-center text-[var(--color-purple)] text-sm font-bold">
                    02
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Generate Art</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] pl-11">
                  Create AI artwork with your prompt. The image becomes the carrier for your message.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[color-mix(in_srgb,var(--color-pink)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-pink)_50%,transparent)] flex items-center justify-center text-[var(--color-pink)] text-sm font-bold">
                    03
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Hide & Share</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] pl-11">
                  Your audio is embedded invisibly using LSB steganography. Share the image anywhere!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              <span className="text-[var(--color-text-muted)]">// </span>
              USE CASES
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Secure Journalism",
                desc: "Protect sources by embedding encrypted communications in innocuous images.",
                icon: Shield
              },
              {
                title: "Corporate Communications",
                desc: "Share confidential information through steganographic channels.",
                icon: Lock
              },
              {
                title: "Digital Art Messages",
                desc: "Artists can embed personal messages or authentication data in artwork.",
                icon: Palette
              },
              {
                title: "Privacy Messaging",
                desc: "Communicate privately using ZKP auth and steganographic data hiding.",
                icon: Terminal
              }
            ].map((item, i) => (
              <div key={i} className="card-terminal p-5 flex gap-4">
                <div className="w-10 h-10 bg-[var(--color-surface-interactive)] border border-[var(--color-border-subtle)] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</h4>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-8">
            <span className="text-[var(--color-text-muted)]">// </span>
            BUILT WITH
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14", "TypeScript", "Tailwind CSS", "snarkjs",
              "FastAPI", "Python", "Pillow", "NumPy", "Hugging Face"
            ].map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--color-cyan)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                ZYPHER v1.0.0
              </span>
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              Built by <span className="text-[var(--color-text-secondary)]">Kartikey Sankhdher</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Kartikey-18/zypher"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
