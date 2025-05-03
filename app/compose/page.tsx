"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ComposeForm from "@/components/compose-form"
import DeliverySettings from "@/components/delivery-settings"
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from '@suiet/wallet-kit'
import { Attachment, DeliverySettingsType } from "@/types/types"
import { uploadToWalrus } from "@/lib/uploadtools"
interface ComposeData {
  subject: string
  content: string
  attachments: Attachment[]
}

export default function ComposePage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'delivery'>('compose')
  const [letterData, setLetterData] = useState<ComposeData>({
    subject: `A letter from ${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}`,
    content: "",
    attachments: [],
  })
  const wallet = useWallet();
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettingsType>({
    deliveryTime: 10,
    visibility: "private",
    recipients: wallet?.address || "0x1",
  })



  const handleSendLetter = async () => {
    try {
      // 1. 获取walrus链接
      const walrusLink = localStorage.getItem("walrusLink");
      if (!walrusLink) throw new Error("Walrus link not configured");

      // 2. 生成信件唯一标识
      const letterId = `letterx_${Math.random().toString(36).substring(2, 7)}`;

      // 3. 准备最终要上传的JSON结构
      const letterJson = {
        metadata: {
          id: letterId,
          subject: letterData.subject,
          deliveryDate: deliverySettings.deliveryTime,
          isPublic: deliverySettings.visibility
        },
        content: letterData.content,
        attachments: [] as Array<{
          originalName: string;
          blobId: string;
          objectId?: string;
          txDigest?: string;
          status: 'new' | 'existing';
        }>
      };
      console.log("Letter JSON:", letterJson);

      const epochs = Math.max(1, deliverySettings.deliveryTime);

      // 4. 如果有附件，先上传附件
      if (letterData.attachments.length > 0) {
        const attachmentUploadResults = await Promise.all(
          letterData.attachments.map(async (attachment) => {
            console.log("Uploading attachment:", {
              baseUrl: walrusLink,
              epochs: epochs,
              sendTo: deliverySettings.recipients
            });
            const uploadResult = await uploadToWalrus(attachment.file, {
              baseUrl: walrusLink,
              epochs: epochs,
              sendTo: deliverySettings.recipients
            });

            // 记录附件上传结果
            return {
              originalName: attachment.name,
              blobId: uploadResult.blobId,
              objectId: uploadResult.objectId,
              txDigest: uploadResult.txDigest,
              status: uploadResult.objectId ? 'new' : 'existing'
            };
          })
        );

        letterJson.attachments = attachmentUploadResults.map(result => ({
          ...result,
          status: result.objectId ? 'new' as const : 'existing' as const
        }));
      }

      // 5. 创建JSON文件并上传
      const jsonBlob = new Blob([JSON.stringify(letterJson, null, 4)], {
        type: 'application/json'
      });
      console.log("JSON Blob:", jsonBlob);
      const jsonFile = new File(
        [jsonBlob],
        `${letterId}.json`,
        { type: 'application/json' }
      );
      console.log("JSON File:", jsonFile);
      const finalUploadResult = await uploadToWalrus(jsonFile, {
        baseUrl: walrusLink,
        epochs: epochs,
        sendTo: deliverySettings.recipients
      });

      console.log("Final upload result:", finalUploadResult);
      // 6. 返回最终结果
      return {
        letterId,
        contentUpload: finalUploadResult,
        attachments: letterJson.attachments
      };

    } catch (error) {
      console.error("Error sending letter:", error);
      throw error;
    }
  };

  const handleregisterletter = async () => {
    try {
      //1. 获取最后上传的json文件
      //2. 判断 有没有objectId，没有的话用blobId
      //3. 调用钱包签名，上传数据到合约中
      const uploadresult = await handleSendLetter();

      const letterid = uploadresult.contentUpload.objectId || uploadresult.contentUpload.blobId;
      const tx = new Transaction();
      const packageObjectId = "0x481bffff7826cef66f3dae9d58dee8c6193c553a3d47c8fdf15568a997cf9463";
      tx.moveCall({
        target: `${packageObjectId}::lettercontract::addletter`,
        arguments: [
          tx.object("0x871518f740ebe98e175698066270866a0a461b3dae7c8c0c88526d1bf129e856"),
          tx.pure.string(letterid),
          tx.pure.u64(uploadresult.contentUpload.endEpoch),
          tx.pure.address(deliverySettings.recipients),
          tx.pure.bool(deliverySettings.visibility === "public"),
        ],
      });
      const resData=await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Letter registered successfully:", resData);
    } catch (error) {
      console.error("Error registering letter:", error);
    }
  }

  if (!wallet.connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">You need to connect your wallet to compose and send letters.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'compose' | 'delivery')} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Letter</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <ComposeForm
            initialData={{
              subject: letterData.subject,
              content: letterData.content,
              attachments: letterData.attachments
            }}
            onComplete={(data) => {
              setLetterData(data)
              setActiveTab("delivery")
            }}
          />
        </TabsContent>
        <TabsContent value="delivery">
          <DeliverySettings
            initialSettings={deliverySettings}
            onSettingsChange={setDeliverySettings}
            onBack={() => setActiveTab("compose")}
            onSend={handleregisterletter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
