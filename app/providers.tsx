"use client"

import {
  WalletProvider,
  SuietWallet,
  SuiWallet,
  Chain,
  SuiDevnetChain,
  SuiTestnetChain,
  SuiMainnetChain,
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

const SupportedChains: Chain[] = [
  SuiDevnetChain,
  SuiTestnetChain,
  SuiMainnetChain,
];

export function Providers({ children, }: { children: React.ReactNode }) {
  return <WalletProvider chains={SupportedChains} defaultWallets={[
    // order defined by you
    SuietWallet,
    SuiWallet,
  ]}>{children}</WalletProvider>
}
