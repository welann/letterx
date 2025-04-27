"use client"

import { WalletProvider } from "@/hooks/use-wallet"

export function Providers({ children }) {
  return <WalletProvider>{children}</WalletProvider>
}
