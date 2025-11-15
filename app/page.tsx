import Link from "next/link"
import { ArrowRight, Lock, Palette, Volume2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Zypher
          </h1>
          <div className="flex gap-6">
            <Link href="/zkp-theater" className="hover:text-primary transition-colors">
              ZKP Demo
            </Link>
            <Link href="/ai-art-vault" className="hover:text-primary transition-colors">
              AI Art Vault
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Where Privacy Meets{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Art
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience cutting-edge privacy technologies through interactive demonstrations:
            Zero-Knowledge Proofs, AI-Generated Art, and Audio Steganography.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link
              href="/zkp-theater"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Live Demos <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/yourusername/zypher"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-input px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Technology Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* ZKP Card */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-muted-foreground mb-4">
              Authenticate without revealing your password. See the difference between traditional
              and ZKP authentication in real-time.
            </p>
            <Link
              href="/zkp-theater"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Art Card */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Art Generation</h3>
            <p className="text-muted-foreground mb-4">
              Create stunning artwork using Stable Diffusion. Choose from multiple artistic styles
              and generate unique images.
            </p>
            <Link
              href="/ai-art-vault"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Steganography Card */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Audio Steganography</h3>
            <p className="text-muted-foreground mb-4">
              Hide voice messages inside AI-generated images using LSB steganography. Share secret
              audio through beautiful art.
            </p>
            <Link
              href="/ai-art-vault"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16 bg-secondary/20 rounded-lg my-16">
        <h3 className="text-3xl font-bold text-center mb-12">Real-World Use Cases</h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6">
            <h4 className="font-semibold mb-2">Secure Journalism</h4>
            <p className="text-muted-foreground text-sm">
              Protect sources by embedding encrypted communications in innocuous-looking images.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h4 className="font-semibold mb-2">Corporate Communications</h4>
            <p className="text-muted-foreground text-sm">
              Share confidential information through steganographic channels that appear as regular
              media.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h4 className="font-semibold mb-2">Digital Art with Messages</h4>
            <p className="text-muted-foreground text-sm">
              Artists can embed personal messages or authentication data within their digital
              artwork.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h4 className="font-semibold mb-2">Privacy-Conscious Messaging</h4>
            <p className="text-muted-foreground text-sm">
              Communicate privately using ZKP authentication and steganographic data hiding.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            Built with Next.js, TypeScript, snarkjs, and Stable Diffusion
          </p>
          <p className="mt-2">
            © 2025 Kartikey Sankhdher. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
