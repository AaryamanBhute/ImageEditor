import {BlobServiceClient, ContainerClient, StorageSharedKeyCredential, UserDelegationKey} from '@azure/storage-blob';
import { DefaultAzureCredential } from "@azure/identity";


class BlobSingleton {
    container: ContainerClient | null;
    client: BlobServiceClient | null;

    constructor() {
        this.container = null;
        this.client = null;
    }

    async initialize() {
        if (!this.container) {
            const containerName = process.env.AZURE_BLOB_CONTAINER;
            if (!containerName) throw new Error("NO CONTAINER SPECIFIED")
            if (!process.env.AZURE_BLOB_CONNECTION_STRING) throw new Error("NO COSMOS CONNECTION STRING SPECIFIED")

            if (!process.env.AZURE_ACCOUNT) throw new Error("NO AZURE ACCOUNT SPECIFIED")
            if (!process.env.AZURE_KEY) throw new Error("NO AZURE KEY SPECIFIED")

            const client = new BlobServiceClient(
                `https://${process.env.AZURE_ACCOUNT}.blob.core.windows.net`,
                new StorageSharedKeyCredential(
                    process.env.AZURE_ACCOUNT,
                    process.env.AZURE_KEY,
                  )
              );
              
            this.client = client
            if (!process.env.AZURE_BLOB_CONTAINER) throw new Error("NO COSMOS CONNECTION STRING SPECIFIED")
            const container = client.getContainerClient(process.env.AZURE_BLOB_CONTAINER)
            this.container = container;
        }
    }

    getContainer() {
        return this.container;
    }

    getClient(){
        return this.client;
    }
}

const blobSingleton = new BlobSingleton();
export default blobSingleton;