import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Eye, Lock, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import LetterAttachments from "@/components/letter-attachments"
import { getLetterById } from "@/lib/letters"

import { Letter } from "@/types/types"

export async function generateMetadata({ params }: { params: Letter }) {
  const letter = await getLetterById(params.id)

  if (!letter) {
    return {
      title: "Letter Not Found - SUI Letters",
    }
  }

  return {
    title: `${letter.title} - SUI Letters`,
    description: `View letter: ${letter.title}`,
  }
}

export default async function LetterDetailPage({ params }: { params: Letter }) {
  const letter = await getLetterById(params.id)

  if (!letter) {
    notFound()
  }

  const formattedDate = new Date(letter.deliveryDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const hasAttachments = letter.attachments && letter.attachments.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href={letter.isPublic ? "/" : "/mine"} className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {letter.isPublic ? "Public Letters" : "My Letters"}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{letter.title}</CardTitle>
              <Badge variant={letter.isPublic ? "secondary" : "outline"}>
                <div className="flex items-center">
                  {letter.isPublic ? <Eye className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  {letter.isPublic ? "Public" : "Private"}
                </div>
              </Badge>
            </div>
            <CardDescription className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Delivery date: {formattedDate}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="prose max-w-none mb-8">
              {letter.content
                .split("\n")
                .map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />))}
            </div>

            {hasAttachments && (
              <>
                <Separator className="my-6" />

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Paperclip className="mr-2 h-5 w-5 text-muted-foreground" />
                    Attachments ({letter.attachments.length})
                  </h2>
                  <LetterAttachments attachments={letter.attachments} fullSize />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
