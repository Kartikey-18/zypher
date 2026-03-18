"use client";

import Link from "next/link"
import { ArrowRight, ArrowLeft, Volume2, Terminal, Shield, Sparkles, Mic, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-primary)]">
      {/* Minimal Nav */}
      <nav className="border-b border-[var(--color-border-subtle)] sticky top-0 bg-[var(--color-surface-primary)]/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--color-cyan)]" />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">ZYPHER</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://kartikey.io"
              className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Back</span>
            </a>
            <a
              href="https://github.com/Kartikey-18/zypher"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero - Two column: Left text, Right magnifying glass animation */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text content */}
            <div className="space-y-6">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] fade-in-up">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
                <span>Audio Steganography Platform</span>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] fade-in-up stagger-1">
                <span className="text-[var(--color-text-primary)]">Hide voices inside</span>
                <br />
                <span className="text-[var(--color-purple)]">AI-generated art</span>
              </h1>

              {/* Subline */}
              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-lg fade-in-up stagger-2">
                Record a message. Generate stunning artwork.
                <span className="text-[var(--color-pink)]"> Your audio becomes invisible</span>—embedded in pixels using LSB steganography.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-2 fade-in-up stagger-3">
                <Link
                  href="/ai-art-vault"
                  className="btn-primary-glow inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
                >
                  Try It Now <ArrowRight className="w-4 h-4" />
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
            </div>

            {/* Right: Magnifying glass animation */}
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-4 md:p-6">
              {/* The artwork with magnifying glass */}
              <div className="relative aspect-square bg-gradient-to-br from-[var(--color-purple)]/20 via-[var(--color-pink)]/15 to-[var(--color-cyan)]/20 border border-[var(--color-border-subtle)] overflow-hidden">
                {/* Fake "artwork" pattern */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)]"
                      style={{
                        width: `${20 + (i % 4) * 15}px`,
                        height: `${20 + (i % 4) * 15}px`,
                        left: `${10 + (i * 8) % 80}%`,
                        top: `${15 + (i * 13) % 70}%`,
                        opacity: 0.3 + (i % 3) * 0.2
                      }}
                    />
                  ))}
                </div>

                {/* Animated magnifying glass */}
                <div className="absolute animate-[magnify_4s_ease-in-out_infinite]" style={{ top: '25%', left: '30%' }}>
                  {/* Glass circle showing waveform */}
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--color-cyan)] bg-[var(--color-surface-primary)]/95 flex items-center justify-center overflow-hidden shadow-lg shadow-[var(--color-cyan)]/20">
                      {/* Waveform inside magnifying glass */}
                      <div className="flex items-end gap-[2px] h-8 md:h-12">
                        {[20, 35, 50, 70, 85, 70, 90, 75, 55, 40, 60, 80, 65, 45, 30].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 md:w-1.5 bg-[var(--color-cyan)] rounded-sm animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Handle */}
                    <div className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 w-10 md:w-14 h-3 md:h-4 bg-[var(--color-text-muted)] rounded-full transform rotate-45 origin-top-left" />
                  </div>
                </div>

                {/* Label */}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-[var(--color-surface-primary)]/90 border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                  AI-Generated Artwork
                </div>
              </div>

              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-3 text-center">
                <span className="text-[var(--color-cyan)]">Zoom in</span> and you&apos;ll find
                <span className="text-[var(--color-pink)]"> audio waveforms </span>
                hidden in the pixels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Minimal, 3 steps inline */}
      <section className="container mx-auto px-4 py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-bold text-[var(--color-text-muted)] tracking-wider">HOW IT WORKS</span>
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                icon: Mic,
                color: "cyan",
                title: "Record",
                desc: "Capture your voice message directly in the browser"
              },
              {
                num: "2",
                icon: Sparkles,
                color: "purple",
                title: "Generate & Embed",
                desc: "AI creates artwork with your audio hidden inside"
              },
              {
                num: "3",
                icon: Volume2,
                color: "pink",
                title: "Upload & Play",
                desc: "Drop any Zypher image to extract and play the hidden audio"
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-[var(--color-border-subtle)]" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 mb-4 bg-[color-mix(in_srgb,var(--color-${item.color})_10%,transparent)] border border-[color-mix(in_srgb,var(--color-${item.color})_30%,transparent)] rounded-xl flex items-center justify-center relative`}>
                    <item.icon className={`w-7 h-7 text-[var(--color-${item.color})]`} />
                    <span className={`absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-${item.color})] text-[var(--color-surface-primary)] text-xs font-bold rounded-full flex items-center justify-center`}>
                      {item.num}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fun explanation */}
          <div className="mt-12 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] p-6 text-center">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <span className="text-[var(--color-cyan)]">Every pixel has millions of possible colors.</span>{" "}
              We tweak the tiniest fraction of each color value—changes so small
              <span className="text-[var(--color-purple)]"> (&lt;0.2%)</span> your eyes literally can&apos;t see the difference.
              But string enough of those invisible tweaks together, and suddenly
              <span className="text-[var(--color-pink)]"> an image can hold an entire voice message</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Deep Dive - For the curious */}
      <section className="container mx-auto px-4 py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-bold text-[var(--color-text-muted)] tracking-wider">UNDER THE HOOD</span>
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Terminal showing the process */}
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-secondary)] border-b border-[var(--color-border-subtle)]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-[var(--color-text-muted)]">steganography.py</span>
              </div>
              <div className="p-4 text-xs font-mono space-y-2">
                <div className="text-[var(--color-text-muted)]"># LSB Audio Encoding</div>
                <div>
                  <span className="text-[var(--color-purple)]">for</span>
                  <span className="text-[var(--color-text-secondary)]"> sample </span>
                  <span className="text-[var(--color-purple)]">in</span>
                  <span className="text-[var(--color-text-secondary)]"> audio_data:</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-muted)]"># Split 16-bit sample</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-secondary)]">high_bits = sample </span>
                  <span className="text-[var(--color-cyan)]">&gt;&gt;</span>
                  <span className="text-[var(--color-yellow)]"> 8</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-secondary)]">low_bits = sample </span>
                  <span className="text-[var(--color-cyan)]">&</span>
                  <span className="text-[var(--color-yellow)]"> 0xFF</span>
                </div>
                <div className="pl-4 mt-2">
                  <span className="text-[var(--color-text-muted)]"># Embed in R+G channels</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-secondary)]">pixel[</span>
                  <span className="text-[var(--color-pink)]">R</span>
                  <span className="text-[var(--color-text-secondary)]">] = embed(high_bits)</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-secondary)]">pixel[</span>
                  <span className="text-[var(--color-green)]">G</span>
                  <span className="text-[var(--color-text-secondary)]">] = embed(low_bits)</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--color-text-muted)]"># Blue channel preserved</span>
                </div>
              </div>
            </div>

            {/* Tech specs */}
            <div className="space-y-4">
              <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--color-purple)]/10 border border-[var(--color-purple)]/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[var(--color-purple)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">AI Art Generation</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">FLUX model via Hugging Face generates 1024×1024 artwork in multiple styles</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--color-pink)]/10 border border-[var(--color-pink)]/30 flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-5 h-5 text-[var(--color-pink)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Lossless Audio</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">16-bit WAV preserved perfectly—zero quality loss on extraction</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[var(--color-cyan)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Visually Identical</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">Blue channel untouched—human eye cannot detect hidden data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases - Clean grid */}
      <section className="container mx-auto px-4 py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
            <span className="text-xs font-bold text-[var(--color-text-muted)] tracking-wider">USE CASES</span>
            <div className="h-px w-8 bg-[var(--color-border-subtle)]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Journalism", desc: "Protect sources" },
              { icon: Lock, title: "Corporate", desc: "Secure memos" },
              { icon: Sparkles, title: "Art Auth", desc: "Embed provenance" },
              { icon: Volume2, title: "Personal", desc: "Private messages" }
            ].map((item, i) => (
              <div key={i} className="group p-5 bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-cyan)]/30 transition-colors text-center">
                <item.icon className="w-6 h-6 mx-auto text-[var(--color-text-muted)] group-hover:text-[var(--color-cyan)] transition-colors mb-3" />
                <h4 className="font-medium text-sm text-[var(--color-text-primary)] mb-1">{item.title}</h4>
                <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built With - Minimal footer badge style */}
      <section className="container mx-auto px-4 py-10 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Built with</span>
            {["Next.js", "TypeScript", "Python", "FLUX", "NumPy"].map((tech) => (
              <span key={tech} className="tech-badge text-xs">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3 text-[var(--color-cyan)]" />
              <span>ZYPHER v1.0.0</span>
            </div>
            <span>Built by <span className="text-[var(--color-text-secondary)]">Kartikey Sankhdher</span></span>
            <a
              href="https://github.com/Kartikey-18/zypher"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
            >
              <GithubIcon className="w-3 h-3" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
