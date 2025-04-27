"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

const WalletContext = createContext({
  connected: false,
  address: "",
  connect: () => { },
  disconnect: () => { },
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")

  // Check if wallet was previously connected
  useEffect(() => {
    const savedConnected = localStorage.getItem("walletConnected")
    const savedAddress = localStorage.getItem("walletAddress")

    if (savedConnected === "true" && savedAddress) {
      setConnected(true)
      setAddress(savedAddress)
    }
  }, [])

  const connect = () => {
    // In a real app, this would connect to a real wallet
    const mockAddress = "0x" + Math.random().toString(36).substring(2, 15)
    setConnected(true)
    setAddress(mockAddress)

    // Save connection state
    localStorage.setItem("walletConnected", "true")
    localStorage.setItem("walletAddress", mockAddress)

    toast("Wallet connected", {
      description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
    })
  }

  const disconnect = () => {
    setConnected(false)
    setAddress("")

    // Clear connection state
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")

    toast("Wallet disconnected",{
      description: "Your wallet has been disconnected.",
    })
  }

  return <WalletContext.Provider value={{ connected, address, connect, disconnect }}>{children}</WalletContext.Provider>
}

export function useWallet() {
  return useContext(WalletContext)
}
