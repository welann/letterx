"use client"

import {
  WalletProvider,
  SuietWallet,
  SuiWallet,
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

export function Providers({ children, }: { children: React.ReactNode }) {
  return <WalletProvider defaultWallets={[
    // order defined by you
    SuietWallet,
    SuiWallet,
  ]}>{children}</WalletProvider>
}
