"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ComposeForm from "@/components/compose-form"
import DeliverySettings from "@/components/delivery-settings"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

import { Attachment, DeliverySettingsType } from "@/types/types"


interface ComposeData {
  subject: string
  content: string
  attachments: Attachment[]
}



export default function ComposePage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'delivery'>('compose')
  const [letterData, setLetterData] = useState<ComposeData>({
    subject: `A letter from ${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}`,
    content: "",
    attachments: [],
  })
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettingsType>({
    deliveryTime: "6 months",
    customDate: null,
    visibility: "private",
    recipients: [""],
    subscription: "free",
  })

  const { connected } = useWallet()
  const router = useRouter()

  // const handleComposeComplete = (data: Letter) => {
  //   setLetterData(data)
  //   setActiveTab("delivery")
  // }

  const handleSendLetter = () => {
    // In a real app, this would send the letter data to the backend
    console.log("Sending letter:", { ...letterData, ...deliverySettings })
    router.push("/")
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">You need to connect your wallet to compose and send letters.</p>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'compose' | 'delivery')} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Letter</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <ComposeForm
            initialData={{
              subject: letterData.subject,
              content: letterData.content,
              attachments: letterData.attachments
            }}
            onComplete={(data) => {
              setLetterData(data)
              setActiveTab("delivery")
            }}
          />
        </TabsContent>
        <TabsContent value="delivery">
          <DeliverySettings
            initialSettings={deliverySettings}
            onSettingsChange={setDeliverySettings}
            onBack={() => setActiveTab("compose")}
            onSend={handleSendLetter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
