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

import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

const SupportedChains: Chain[] = [
  SuiDevnetChain,
  SuiTestnetChain,
  SuiMainnetChain,
];

export function Providers({ children, }: { children: React.ReactNode }) {
  return <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
    <WalletProvider chains={SupportedChains} defaultWallets={[
      // order defined by you
      SuietWallet,
      SuiWallet,
    ]}>{children}</WalletProvider>
  </SuiClientProvider>


}
