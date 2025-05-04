import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SUI Letters",
  description: "Send letters to your future self or loved ones on the SUI blockchain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="py-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} SUI Letters. All rights reserved.
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
