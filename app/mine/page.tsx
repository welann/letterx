"use client"

import { useState, useEffect } from "react"
import { useWallet } from '@suiet/wallet-kit'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
// import { getMyLetters } from "@/lib/lettertools"
import { Lettertype } from "@/types/types"

// import { useSuiClientQuery } from '@mysten/dapp-kit';

// create a client connected to devnet



export default function MinePage() {
  const [letters, setLetters] = useState<Lettertype[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null)
  const wallet = useWallet();

  // const { data, isPending, error, refetch } = useSuiClientQuery('getOwnedObjects', {
  //   owner: '0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0',
  // })

  // console.log("data", data)
  // console.log("isPending", isPending)
  // console.log("error", error)
  // console.log("refetch", refetch)


  useEffect(() => {

    const handleregisterletter = async () => {

      // const client = new SuiClient({ url: rpcUrl });



      // const Letter = bcs.struct('Letter', {
      //   blobid: bcs.String,
      //   endepoch: bcs.U64,
      //   recipient: bcs.Address, // address在BCS中通常作为string处理
      //   ispublic: bcs.Bool,
      // });
      // const Vletters = bcs.vector(Letter);

      // try {
      //   //1. 调用合约中的search函数
      //   //2. 解析返回的两个vector
      //   console.log("wallet addr: ", wallet.address)
      //   const tx = new Transaction();
      //   const packageObjectId = "0xdfad80440ad76490232d410646ba2f7652ad911b351f045e80767efddb2a0bb3";
      //   tx.moveCall({
      //     target: `${packageObjectId}::lettercontract::searchpublic`,
      //     arguments: [
      //       tx.object("0x9bb14ed4792a02543709b267bb1dd0f4d191ee2af800b91d74197f6c50013ba1"),
      //       // tx.pure.string(wallet.address ? wallet.address : "0x1"),
      //     ],
      //   });
      //   const resData = await wallet.signAndExecuteTransaction({
      //     transaction: tx,
      //   });
      //   console.log("Letter registered successfully:", JSON.stringify(resData, null, 2));

      //   const pdata = Vletters.fromBase64(resData.effects)
      //   console.log("pdata", pdata);
      //   // 将字符串地址转换为Uint8Array格式
      //   const addr = bcs.Address.parse(pdata[0].recipient)
      //   console.log("addr", addr)
      // } catch (error) {
      //   console.error("Error registering letter:", error);
      // }
    }


    async function fetchLetters() {
      if (wallet.connected) {
        try {
          handleregisterletter()
          // const myLetters = await getMyLetters()
          // setLetters(myLetters)
        } catch (error) {
          console.error("Error fetching my letters:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchLetters()
  }, [wallet])

  const handleDelete = (id: string) => {
    setLetters(letters.filter((letter) => letter.id !== id))
    setLetterToDelete(null)
    toast("Letter deleted", {
      description: "Your letter has been deleted successfully.",
    })
  }



  if (!wallet.connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">You need to connect your wallet to view your letters.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Letters</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
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
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Letters</h1>

      {letters.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You havent sent any letters yet.</p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/compose">Compose a Letter</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter: Lettertype) => (
            <Card key={letter.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Link href={`/letters/${letter.id}`} className="block hover:opacity-80 transition-opacity">
                  <h2 className="text-xl font-semibold mb-2">{letter.subject}</h2>
                  <p className="text-muted-foreground line-clamp-3">{letter.content}</p>
                </Link>
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
                <div className="flex items-center gap-2">
                  <AlertDialog
                    open={letterToDelete === letter.id}
                    onOpenChange={(open) => !open && setLetterToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLetterToDelete(letter.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your letter.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(letter.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="ghost" asChild className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    <Link href={`/letters/${letter.id}`}>View</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
