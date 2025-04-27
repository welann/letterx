import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LetterNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Letter Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The letter you're looking for doesn't exist or you may not have permission to view it.
      </p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
