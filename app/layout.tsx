import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { GoToTop } from "@/components/ui/go-to-top"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Netest - Test Kecepatan Internet Modern",
  description:
    "Tes kecepatan internet modern dengan analisis jaringan komprehensif, benchmark streaming, dan rating kualitas koneksi.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/favicon.ico' }
    ]
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-950 text-gray-100 min-h-screen`}>
        {children}
        <GoToTop />
      </body>
    </html>
  )
}
