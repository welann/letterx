

export async function uploadToWalrus(file: File, config: {
    baseUrl: string;
    epochs?: number;
    sendTo?: string;
}): Promise<{
    blobId: string;
    endEpoch: number;
    txDigest?: string;
    objectId?: string;
}> {
    const { baseUrl, epochs = 1, sendTo } = config;

    try {
        const sendToParam = sendTo ? `&send_object_to=${sendTo}` : '';
        console.log(`${baseUrl}/v1/blobs?epochs=${epochs}${sendToParam}`)
        const response = await fetch(`${baseUrl}/v1/blobs?epochs=${epochs}${sendToParam}`, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = await response.json();

        if ('alreadyCertified' in data) {
            return {
                blobId: data.alreadyCertified.blobId,
                endEpoch: data.alreadyCertified.endEpoch,
                txDigest: data.alreadyCertified.event.txDigest,
            };
        } else if ('newlyCreated' in data) {
            return {
                blobId: data.newlyCreated.blobObject.blobId,
                endEpoch: data.newlyCreated.blobObject.storage.endEpoch,
                objectId: data.newlyCreated.blobObject.id,
            };
        } else {
            throw new Error('Unknown response format from Walrus');
        }
    } catch (error) {
        console.error('Error uploading to Walrus:', error);
        throw error;
    }
}



