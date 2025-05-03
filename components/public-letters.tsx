"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getPublicLetters } from "@/lib/lettertools"
import { Lettertype } from "@/types/types"

import { Calendar } from "lucide-react"

export default function PublicLetters() {
  const [letters, setLetters] = useState<Lettertype[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLetters() {
      try {
        const publicLetters = await getPublicLetters()
        setLetters(publicLetters)
      } catch (error) {
        console.error("Error fetching public letters:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLetters()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {letters.map((letter) => (
        <Card key={letter.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{letter.subject}</h3>
            <p className="text-muted-foreground line-clamp-3">{letter.content}</p>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(letter.deliveryDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Badge>
            <Button variant="ghost" asChild className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
              <Link href={`/letters/${letter.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
