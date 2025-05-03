import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Link from "next/link"
// import PublicLetters from "@/components/public-letters"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-none shadow-sm mb-12">
        <CardContent className="p-8 md:p-12">
          <div className="text-center py-8 space-y-6 max-w-3xl mx-auto">
            <CardTitle className="text-4xl md:text-5xl font-bold">SUI Letters</CardTitle>
            <p className="text-xl text-muted-foreground">
              Send letters to your future self or loved ones. Choose when theyll be delivered and create memories that
              last.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Link href="/compose">Compose a Letter</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Public Letters</h2>
        {/* <PublicLetters /> */}
      </div>
    </div>
  )
}
