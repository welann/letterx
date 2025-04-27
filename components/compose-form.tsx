"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Paperclip, AlertCircle } from "lucide-react"
import LetterAttachments from "./letter-attachments"
import { Attachment, ComposeFormProps } from "@/types/types"


export default function ComposeForm({ initialData, onComplete }: ComposeFormProps) {
  const [subject, setSubject] = useState(initialData.subject || "")
  const [content, setContent] = useState(initialData.content || "")
  const [attachments, setAttachments] = useState(initialData.attachments || [])
  const [wordCount, setWordCount] = useState(content.trim().split(/\s+/).filter(Boolean).length)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setWordCount(newContent.trim().split(/\s+/).filter(Boolean).length)
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFileError("")

    const newAttachments: Attachment[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type,
      size: file.size,
      file,
      url: URL.createObjectURL(file),
    }));

    setAttachments([...attachments, ...newAttachments])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // const removeAttachment = (id: string) => {
  //   setAttachments(attachments.filter((attachment) => attachment.id !== id))
  // }

  const handleSubmit = () => {
    onComplete({
      subject,
      content,
      attachments,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Your Letter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject for your letter"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Dear FutureMe,"
            className="min-h-[300px] resize-none"
            value={content}
            onChange={handleContentChange}
          />
          <div className="text-xs text-muted-foreground">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </div>

        {fileError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label>Attachments ({attachments.length})</Label>
            <LetterAttachments attachments={attachments} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button variant="outline" onClick={handleAttachmentClick} className="flex items-center">
            <Paperclip className="h-4 w-4 mr-2" />
            Add attachment
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700"
          disabled={!subject.trim() || !content.trim()}
        >
          Next: Delivery Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
