"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  File,
  Download,
  ImageIcon,
  FileText,
  FileArchive,
  FileAudio,
  FileVideo,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileCode,
  Maximize2,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Attachment } from "@/types/types"


export default function LetterAttachments({ attachments, fullSize = false }: { attachments: Attachment[], fullSize?: boolean }) {
  const [selectedImage, setSelectedImage] = useState<Attachment>()

  const getFileIcon = (filetype: string) => {
    if (filetype.startsWith("image/")) return <ImageIcon className="h-10 w-10 text-blue-500" />
    if (filetype.startsWith("text/")) return <FileText className="h-10 w-10 text-green-500" />
    if (filetype.startsWith("audio/")) return <FileAudio className="h-10 w-10 text-purple-500" />
    if (filetype.startsWith("video/")) return <FileVideo className="h-10 w-10 text-red-500" />
    if (filetype.includes("pdf")) return <FilePdf className="h-10 w-10 text-red-600" />
    if (filetype.includes("spreadsheet") || filetype.includes("excel"))
      return <FileSpreadsheet className="h-10 w-10 text-green-600" />
    if (filetype.includes("zip") || filetype.includes("compressed"))
      return <FileArchive className="h-10 w-10 text-yellow-600" />
    if (filetype.includes("html") || filetype.includes("javascript") || filetype.includes("css"))
      return <FileCode className="h-10 w-10 text-blue-600" />
    return <File className="h-10 w-10 text-gray-500" />
  }

  const getFileTypeLabel = (filetype: string) => {
    if (filetype.startsWith("image/")) return filetype.split("/")[1].toUpperCase()
    if (filetype.startsWith("text/")) return "Text"
    if (filetype.startsWith("audio/")) return "Audio"
    if (filetype.startsWith("video/")) return "Video"
    if (filetype.includes("pdf")) return "PDF"
    if (filetype.includes("spreadsheet") || filetype.includes("excel")) return "Spreadsheet"
    if (filetype.includes("zip") || filetype.includes("compressed")) return "Archive"
    if (filetype.includes("html") || filetype.includes("javascript") || filetype.includes("css")) return "Code"
    return "File"
  }


  if (!attachments || attachments.length === 0) {
    return null
  }

  return (
    <>
      <div className={cn("grid gap-4", fullSize ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-wrap")}>
        {attachments.map((attachment) => (
          <Card
            key={attachment.id}
            className={cn(
              "overflow-hidden transition-all hover:shadow-md",
              fullSize ? "w-full" : "w-24 h-24 mr-3 mb-3",
            )}
          >
            {attachment.type.startsWith("image/") ? (
              <div className={cn("relative group", fullSize ? "flex flex-col" : "h-full")}>
                <div
                  className={cn("relative overflow-hidden", fullSize ? "h-48" : "h-full w-full")}
                  onClick={() => fullSize && setSelectedImage(attachment as Attachment)}
                >
                  <Image
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name}
                    fill
                    className={cn(
                      "object-cover transition-transform",
                      fullSize && "group-hover:scale-105 cursor-pointer",
                    )}
                  />
                  {fullSize && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
                {fullSize && (
                  <CardFooter className="p-3 flex items-center justify-between">
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-medium truncate max-w-[150px]">{attachment.name}</p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{attachment.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs font-normal">
                          {getFileTypeLabel(attachment.type)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        // In a real app, this would download the file
                        window.open(attachment.url, "_blank")
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </div>
            ) : (
              <div className={cn("flex", fullSize ? "flex-col" : "flex-col items-center justify-center p-2 h-full")}>
                {fullSize ? (
                  <>
                    <CardContent className="flex items-center justify-center p-6 bg-muted/30 h-48">
                      {getFileIcon(attachment.type)}
                    </CardContent>
                    <CardFooter className="p-3 flex items-center justify-between">
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="font-medium truncate max-w-[150px]">{attachment.name}</p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{attachment.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs font-normal">
                            {getFileTypeLabel(attachment.type)}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    {getFileIcon(attachment.type)}
                    <span className="text-xs truncate w-full text-center mt-1">
                      {attachment.name.length > 10 ? `${attachment.name.substring(0, 7)}...` : attachment.name}
                    </span>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(undefined)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="truncate">{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] bg-muted/30">
            <Image src={selectedImage?.url || ""} alt={selectedImage?.name || ""} fill className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
