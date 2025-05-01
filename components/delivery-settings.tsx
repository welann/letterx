"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, LockIcon, UnlockIcon } from "lucide-react"
import { DeliverySettingsProps } from "@/types/types"
import { useWallet } from "@suiet/wallet-kit"

export default function DeliverySettings({ initialSettings, onSettingsChange, onBack, onSend }: DeliverySettingsProps) {
  const wallet = useWallet()
  const [deliveryTime, setDeliveryTime] = useState<number>(initialSettings.deliveryTime || 10)
  const [visibility, setVisibility] = useState<'private' | 'public'>(
    initialSettings.visibility === 'private' ? 'private' : "public"
  )
  const [recipients, setRecipients] = useState<string>(initialSettings.recipients || wallet.address || "")

  const handleDeliveryTimeChange = (time: number) => {
    setDeliveryTime(time)
    onSettingsChange({
      ...initialSettings,
      deliveryTime: time,
    })
  }

  const handleVisibilityChange = (isPrivate: boolean) => {
    const newVisibility = isPrivate ? "private" : "public"
    setVisibility(newVisibility)
    onSettingsChange({
      ...initialSettings,
      visibility: newVisibility,
    })
  }

  const handleRecipientChange = (value: string) => {
    const newRecipients = value
    setRecipients(newRecipients)
    onSettingsChange({
      ...initialSettings,
      recipients: newRecipients,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-teal-600" />
            <h3 className="text-lg font-medium">Delivery Time (Weeks)</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="52"
                value={deliveryTime}
                onChange={(e) => {
                  const value = Math.min(52, Math.max(0, parseInt(e.target.value) || 0))
                  handleDeliveryTimeChange(value)
                }}
                placeholder="Enter weeks (0-52)"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {deliveryTime} week{deliveryTime !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Quick select:</span>
            {[4, 8, 12, 26, 52].map((weeks) => (
              <Button
                key={weeks}
                variant={deliveryTime === weeks ? "default" : "outline"}
                size="sm"
                onClick={() => handleDeliveryTimeChange(weeks)}
                className={deliveryTime === weeks ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {weeks}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-teal-600" />
            <h3 className="text-lg font-medium">Recipients</h3>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="txt"
              placeholder={wallet.address || "Enter recipient address"}
              value={recipients}
              onChange={(e) => handleRecipientChange(e.target.value)}
              className="flex-1"
            />
          </div>

        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            {visibility === "private" ? (
              <LockIcon className="h-5 w-5 mr-2 text-teal-600" />
            ) : (
              <UnlockIcon className="h-5 w-5 mr-2 text-teal-600" />
            )}
            <h3 className="text-lg font-medium">Letter Visibility</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="letter-visibility">Private</Label>
              <p className="text-sm text-muted-foreground">Only recipients can view this letter</p>
            </div>
            <Switch
              id="letter-visibility"
              checked={visibility === "private"}
              onCheckedChange={handleVisibilityChange}
            />
          </div>
        </div>

        <Separator />

      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Editing
        </Button>
        <Button onClick={onSend} className="bg-teal-600 hover:bg-teal-700">
          Send Letter
        </Button>
      </CardFooter>
    </Card>
  )
}
