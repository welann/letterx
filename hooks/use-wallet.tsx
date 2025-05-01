

import { WalletContextState } from "@suiet/wallet-kit";
import { toast } from "sonner";

export const handleSignMsg = async (wallet: WalletContextState) => {
  if (!wallet.connected || !wallet.account) return

  try {
    const message = "Sign this message to verify your wallet ownership";
    const result = await wallet.signPersonalMessage({
      message: new TextEncoder().encode(message),
    });
    const verifyResult = await wallet.verifySignedMessage(result, new Uint8Array(wallet.account.publicKey))
    if (!verifyResult) {
      toast("Verification Failed", {
        description: "Signing failed",
      });
      console.log('signPersonalMessage succeed, but verify signedMessage failed')
      return null
    } else {
      toast("Verification Successful", {
        description: "Wallet ownership verified",
      });
      console.log('signPersonalMessage succeed, and verify signedMessage succeed!')
      return result;
    }
  } catch (error) {
    toast("Verification Failed", {
      description: error instanceof Error ? error.message : "Signing cancelled",
    });
    throw error;
  }
};