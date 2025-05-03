// import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Lettertype } from "@/types/types";


// const rpcUrl = getFullnodeUrl('testnet');
// const client = new SuiClient({ url: rpcUrl });

export async function getPublicLetters(): Promise<Lettertype[]> {
    try {

        // const usermanager = await client.getDynamicFieldObject({
        //     parentId: "0xb77314a9f6621b84295ff68a767ac018adbb97801b9ae5f348575a8e77b3c846",
        //     name: { type: "0x2::dynamic_field::Field<address, 0xdfad80440ad76490232d410646ba2f7652ad911b351f045e80767efddb2a0bb3::lettercontract::Userletters>", value: "1" },
        // });
        return []
    } catch (error) {
        console.error('Error fetching public letters:', error);
        throw error;
    }
}

export async function getMyLetters(): Promise<Lettertype[][]> {
    try {

        return []
    } catch (error) {
        console.error('Error fetching my letters:', error);
        throw error;
    }
}

export async function getLetterById(id: string, shouldParseJson: boolean = false, aggregatorUrl: string = "https://aggregator.walrus-testnet.walrus.space") {
    try {
        const response = await fetch(`${aggregatorUrl}/v1/blobs/by-object-id/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 根据参数决定返回格式
        if (shouldParseJson) {
            return await response.json();
        } else {
            return await response.arrayBuffer(); // 比bytes()更标准的API
        }
    } catch (error) {
        console.error(`Failed to fetch letter ${id}:`, error);
        return null;
    }
}


getLetterById(
    "0xfa18be1a703bb4fc331d03558fcf896c19ccaec4dee57d9614817bdea9937ef7",
    true,
    "https://aggregator.walrus-testnet.walrus.space").then(console.log);

