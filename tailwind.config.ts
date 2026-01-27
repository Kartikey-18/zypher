import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Surface colors (DeepFish style)
        surface: {
          primary: '#0a0a0a',
          secondary: '#111111',
          tertiary: '#151515',
          hover: '#181818',
          elevated: '#0f0f0f',
          interactive: '#1a1a1a',
          accent: '#2a2a2a',
        },
        // Standard theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Accent colors with opacity variants
        cyan: {
          DEFAULT: 'rgba(99, 179, 237, 0.9)',
          90: 'rgba(99, 179, 237, 0.9)',
          60: 'rgba(99, 179, 237, 0.6)',
          40: 'rgba(99, 179, 237, 0.4)',
          20: 'rgba(99, 179, 237, 0.2)',
        },
        purple: {
          DEFAULT: 'rgba(183, 148, 244, 0.9)',
          90: 'rgba(183, 148, 244, 0.9)',
          60: 'rgba(183, 148, 244, 0.6)',
          40: 'rgba(183, 148, 244, 0.4)',
          20: 'rgba(183, 148, 244, 0.2)',
        },
        pink: {
          DEFAULT: 'rgba(246, 173, 255, 0.9)',
          90: 'rgba(246, 173, 255, 0.9)',
          60: 'rgba(246, 173, 255, 0.6)',
          40: 'rgba(246, 173, 255, 0.4)',
          20: 'rgba(246, 173, 255, 0.2)',
        },
        neon: {
          green: 'rgba(154, 230, 180, 0.9)',
          red: 'rgba(254, 178, 178, 0.9)',
          yellow: 'rgba(250, 240, 137, 0.9)',
          cyan: 'rgba(129, 230, 217, 0.9)',
        },
      },
      // Sharp edges - terminal aesthetic
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        none: "0",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        // Rainbow border animation
        "rainbow-border": {
          "0%, 100%": { borderColor: "rgba(255, 0, 0, 0.7)" },
          "14%": { borderColor: "rgba(255, 127, 0, 0.7)" },
          "28%": { borderColor: "rgba(255, 255, 0, 0.7)" },
          "42%": { borderColor: "rgba(0, 255, 0, 0.7)" },
          "57%": { borderColor: "rgba(0, 0, 255, 0.7)" },
          "71%": { borderColor: "rgba(75, 0, 130, 0.7)" },
          "85%": { borderColor: "rgba(148, 0, 211, 0.7)" },
        },
        // Glitch text effect
        "glitch": {
          "0%, 100%": {
            textShadow: "2px 2px 0 cyan, -2px -2px 0 magenta",
            transform: "translate(0)",
          },
          "25%": {
            textShadow: "-2px -2px 0 cyan, 2px 2px 0 magenta",
            transform: "translate(-2px, 2px)",
          },
          "50%": {
            textShadow: "2px -2px 0 cyan, -2px 2px 0 magenta",
            transform: "translate(2px, -2px)",
          },
          "75%": {
            textShadow: "-2px 2px 0 cyan, 2px -2px 0 magenta",
            transform: "translate(-2px, -2px)",
          },
        },
        // Pulse effects
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(22, 163, 74, 0.4)" },
          "50%": { boxShadow: "0 0 12px rgba(22, 163, 74, 0.8)" },
        },
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(99, 179, 237, 0.4)" },
          "50%": { boxShadow: "0 0 12px rgba(99, 179, 237, 0.8)" },
        },
        "pulse-purple": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(183, 148, 244, 0.4)" },
          "50%": { boxShadow: "0 0 12px rgba(183, 148, 244, 0.8)" },
        },
        // Terminal cursor blink
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Typing animation
        "typing": {
          from: { width: "0" },
          to: { width: "100%" },
        },
        // Glow animation
        "glow": {
          "0%, 100%": {
            textShadow: "0 0 5px rgba(99, 179, 237, 0.5), 0 0 10px rgba(99, 179, 237, 0.3)"
          },
          "50%": {
            textShadow: "0 0 10px rgba(99, 179, 237, 0.8), 0 0 20px rgba(99, 179, 237, 0.5), 0 0 30px rgba(99, 179, 237, 0.3)"
          },
        },
        // Scanline flicker
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in",
        "slide-up": "slide-up 0.4s ease-out",
        "rainbow-border": "rainbow-border 10s linear infinite",
        "glitch": "glitch 2.5s infinite",
        "pulse-green": "pulse-green 2s infinite",
        "pulse-cyan": "pulse-cyan 2s infinite",
        "pulse-purple": "pulse-purple 2s infinite",
        "blink": "blink 1s step-end infinite",
        "typing": "typing 2s steps(40, end)",
        "glow": "glow 2s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
