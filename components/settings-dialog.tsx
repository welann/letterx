"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { SettingsDialogProps } from "@/types/types"

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [integration, setIntegration] = useState<'tusky' | 'walrus'>("tusky")
  const [tuskyLink, setTuskyLink] = useState<string>("")
  const [walrusLink, setWalrusLink] = useState<string>("")

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedIntegration = localStorage.getItem("integration") as 'tusky' | 'walrus' | null
    const savedTuskyLink = localStorage.getItem("tuskyLink")
    const savedWalrusLink = localStorage.getItem("walrusLink")

    if (savedIntegration) setIntegration(savedIntegration)
    if (savedTuskyLink) setTuskyLink(savedTuskyLink)
    if (savedWalrusLink) setWalrusLink(savedWalrusLink)
  }, [])

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("integration", integration)
    localStorage.setItem("tuskyLink", tuskyLink)
    localStorage.setItem("walrusLink", walrusLink)

    toast("Settings saved", {
      description: "Your integration settings have been saved."
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Integration Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <RadioGroup
                value={integration}
                onValueChange={(value) => setIntegration(value as 'tusky' | 'walrus')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="walrus" id="walrus" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="walrus" className="font-medium">
                      Walrus Integration
                    </Label>
                    <CardDescription>Connect with Walrus for enhanced functionality</CardDescription>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="tusky" id="tusky" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="tusky" className="font-medium">
                      Tusky Integration
                    </Label>
                    <CardDescription>Connect with Tusky for enhanced functionality</CardDescription>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="none" className="font-medium">
                      No Integration
                    </Label>
                    <CardDescription>Use SUI Letters without third-party integrations</CardDescription>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {integration === "tusky" && (
            <div className="space-y-2">
              <Label htmlFor="tusky-link">Tusky Link</Label>
              <Input
                id="tusky-link"
                placeholder="Enter your Tusky link"
                value={tuskyLink}
                onChange={(e) => setTuskyLink(e.target.value)}
              />
            </div>
          )}

          {integration === "walrus" && (
            <div className="space-y-2">
              <Label htmlFor="walrus-link">Walrus API Key</Label>
              <Input
                id="walrus-link"
                placeholder="Enter your Walrus API key"
                value={walrusLink}
                onChange={(e) => setWalrusLink(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full bg-teal-600 hover:bg-teal-700">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
