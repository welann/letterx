"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Mail, X, Clock, LockIcon, UnlockIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DeliverySettingsProps } from "@/types/types"

export default function DeliverySettings({ initialSettings, onSettingsChange, onBack, onSend }: DeliverySettingsProps) {
  const [deliveryTime, setDeliveryTime] = useState<string>(initialSettings.deliveryTime || "6 months")
  const [customDate, setCustomDate] = useState<Date | null>(initialSettings.customDate || null)
  const [visibility, setVisibility] = useState<'private' | 'public'>(
    initialSettings.visibility === 'private' ? 'private' : "public"
  )
  const [recipients, setRecipients] = useState<string[]>(initialSettings.recipients || [""])
  const [subscription, setSubscription] = useState<'free' | 'premium'>(
    initialSettings.subscription === 'premium' ? 'premium' : "free"
  )

  // Calculate min and max dates for the calendar
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const twoYearsFromNow = new Date(today)
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)

  const handleDeliveryTimeChange = (time: string) => {
    setDeliveryTime(time)
    setCustomDate(null)
    onSettingsChange({
      ...initialSettings,
      deliveryTime: time,
      customDate: null,
    })
  }

  const handleCustomDateChange = (date: Date) => {
    if (!date) return
    setCustomDate(date)
    setDeliveryTime("custom")
    onSettingsChange({
      ...initialSettings,
      deliveryTime: "custom",
      customDate: date,
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

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
    onSettingsChange({
      ...initialSettings,
      recipients: newRecipients,
    })
  }

  const addRecipient = () => {
    setRecipients([...recipients, ""])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      const newRecipients = recipients.filter((_, i) => i !== index)
      setRecipients(newRecipients)
      onSettingsChange({
        ...initialSettings,
        recipients: newRecipients,
      })
    }
  }

  const handleSubscriptionChange = (value: 'free' | 'premium') => {
    setSubscription(value)
    onSettingsChange({
      ...initialSettings,
      subscription: value,
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
            <h3 className="text-lg font-medium">Delivery Time</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {["6 months", "1 year", "3 years", "5 years", "10 years"].map((time) => (
              <Button
                key={time}
                variant={deliveryTime === time ? "default" : "outline"}
                onClick={() => handleDeliveryTimeChange(time)}
                className={deliveryTime === time ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {time}
              </Button>
            ))}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">or select</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !customDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, "PPP") : "Custom date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDate ? new Date(customDate) : undefined}
                  onSelect={(date) => date && handleCustomDateChange(date)}
                  disabled={(date) => date < tomorrow || date > twoYearsFromNow}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-teal-600" />
            <h3 className="text-lg font-medium">Recipients</h3>
          </div>
          {recipients.map((recipient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={recipient}
                onChange={(e) => handleRecipientChange(index, e.target.value)}
                className="flex-1"
              />
              {recipients.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeRecipient(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRecipient}>
            Add more recipients
          </Button>
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Subscription Options</h3>
          <RadioGroup value={subscription} onValueChange={handleSubscriptionChange}>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="free" id="free-tier" />
              <div className="grid gap-1.5">
                <Label htmlFor="free-tier" className="font-medium">
                  Free tier
                </Label>
                <p className="text-sm text-muted-foreground">Send your first letter (no attachments)</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="premium" id="premium-tier" />
              <div className="grid gap-1.5">
                <Label htmlFor="premium-tier" className="font-medium">
                  Premium tier
                </Label>
                <p className="text-sm text-muted-foreground">Send letters with attachments and additional features</p>
              </div>
            </div>
          </RadioGroup>
        </div>
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
