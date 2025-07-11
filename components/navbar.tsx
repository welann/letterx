"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Home, Mail, Mailbox, Info, Settings, Menu } from "lucide-react"
import SettingsDialog from "@/components/settings-dialog"
import { ConnectButton, BaseError, ErrorCode } from '@suiet/wallet-kit';
// import { useWallet, WalletContextState } from "@suiet/wallet-kit"
// import { toast } from "sonner"

export default function Navbar() {
  const pathname = usePathname()
  // const wallet = useWallet();
  const [settingsOpen, setSettingsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/compose", label: "Compose", icon: <Mail className="h-4 w-4 mr-2" /> },
    { href: "/mine", label: "My Letters", icon: <Mailbox className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
  ]

  // const handleConnectSuccess = async (wallet: WalletContextState) => {
  //   if (!wallet.connected || !wallet.account) {
  //     toast.warning("Wallet not connected yet");
  //     return;
  //   }

  //   try {
  //     const message = "Sign this message to verify your wallet ownership";
  //     const result = await wallet.signPersonalMessage({
  //       message: new TextEncoder().encode(message),
  //     });
  //     const verifyResult = await wallet.verifySignedMessage(result, new Uint8Array(wallet.account.publicKey))
  //     if (!verifyResult) {
  //       toast("Verification Failed", {
  //         description: "Signing failed",
  //       });
  //       console.log('signPersonalMessage succeed, but verify signedMessage failed')
  //       return null
  //     } else {
  //       toast("Verification Successful", {
  //         description: "Wallet ownership verified",
  //       });
  //       console.log('signPersonalMessage succeed, and verify signedMessage succeed!')
  //       return result;
  //     }
  //   } catch (error) {
  //     console.error("Signing failed:", error);
  //   }
  // };


  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Mail className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-xl font-bold">Letterx</span>
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
            <ConnectButton
              // onConnectSuccess={() => { handleConnectSuccess(wallet) }}
              onConnectError={(error: BaseError) => {
                if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
                  console.warn('user rejected the connection to ' + error.details?.wallet);
                } else {
                  console.warn('unknown connect error: ', error);
                }
              }}
            >Connect Wallet</ConnectButton>

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
              <SheetHeader>
                <SheetTitle>letterx</SheetTitle>
                <SheetDescription>
                  Send letters to your future self or loved ones. Choose when theyll be delivered and create memories
                  that last.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
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
                <ConnectButton
                  // The BaseError instance has properties like {code, message, details}
                  // for developers to further customize their error handling.
                  onConnectError={(error: BaseError) => {
                    if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
                      console.warn('user rejected the connection to ' + error.details?.wallet);
                    } else {
                      console.warn('unknown connect error: ', error);
                    }
                  }}
                >Connect Wallet</ConnectButton>


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
