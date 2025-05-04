import { Mail, Clock, Lock, Database, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold mb-6">About Letterx</h1>
        <p className="text-xl text-muted-foreground">
          A modern platform for sending time-delayed letters on the SUI blockchain
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Mail className="h-5 w-5 text-teal-600 mr-2" />
                Compose Your Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Write a letter to your future self or a loved one. Add images, files, and personalize your message.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Clock className="h-5 w-5 text-teal-600 mr-2" />
                Set Delivery Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose when your letter will be delivered. It could be next month, next year, or even further in the
                future.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Lock className="h-5 w-5 text-teal-600 mr-2" />
                Optional Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep your letter private with encryption, or make it public for others to read and be inspired.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Database className="h-5 w-5 text-teal-600 mr-2" />
                Blockchain Secured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your letters are securely stored on the SUI blockchain, ensuring they cant be altered or deleted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      <div>
        <h2 className="text-3xl font-bold mb-8">Core Technologies</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
              SUI Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A layer-1 blockchain that enables creators and developers to build experiences that cater to the next
              billion users in web3.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
