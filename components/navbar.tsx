"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Mail, Info, Wallet, Settings, Menu } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import SettingsDialog from "./settings-dialog"

export default function Navbar() {
  const pathname = usePathname()
  const { connected, connect, disconnect } = useWallet()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/compose", label: "Compose", icon: <Mail className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Mail className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-xl font-bold">SUI Letters</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild className={pathname === item.href ? "bg-muted" : ""}>
                <Link href={item.href} className="flex items-center">
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}

            {connected && (
              <Button variant="ghost" asChild className={pathname === "/mine" ? "bg-muted" : ""}>
                <Link href="/mine">My Letters</Link>
              </Button>
            )}

            <Button
              onClick={connected ? disconnect : connect}
              className={connected ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {connected ? "Disconnect" : "Connect Wallet"}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={pathname === item.href ? "justify-start bg-muted" : "justify-start"}
                  >
                    <Link href={item.href} className="flex items-center">
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                ))}

                {connected && (
                  <Button
                    variant="ghost"
                    asChild
                    className={pathname === "/mine" ? "justify-start bg-muted" : "justify-start"}
                  >
                    <Link href="/mine">My Letters</Link>
                  </Button>
                )}

                <Button
                  onClick={connected ? disconnect : connect}
                  className={connected ? "justify-start bg-teal-600 hover:bg-teal-700" : "justify-start"}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {connected ? "Disconnect" : "Connect Wallet"}
                </Button>

                <Button variant="ghost" className="justify-start" onClick={() => setSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  )
}
