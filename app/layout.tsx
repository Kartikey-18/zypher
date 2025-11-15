import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zypher - Privacy Technology Platform",
  description: "Demonstrating Zero-Knowledge Proofs, AI Art Generation, and Audio Steganography",
  keywords: ["ZKP", "Zero-Knowledge Proofs", "AI Art", "Steganography", "Privacy", "Cryptography"],
  authors: [{ name: "Kartikey Sankhdher" }],
  openGraph: {
    title: "Zypher - Where Privacy Meets Art",
    description: "Interactive demonstrations of cutting-edge privacy technologies",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
