import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';

class BlobSingleton {
    container: ContainerClient | null;
    constructor() {
        this.container = null;
    }

    async initialize() {
        if (!this.container) {
            const containerName = process.env.AZURE_BLOB_CONTAINER;
            if (!containerName) throw new Error("NO CONTAINER SPECIFIED")
            if (!process.env.AZURE_BLOB_CONNECTION_STRING) throw new Error("NO COSMOS CONNECTION STRING SPECIFIED")
            const client = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECTION_STRING);
            if (!process.env.AZURE_BLOB_CONTAINER) throw new Error("NO COSMOS CONNECTION STRING SPECIFIED")
            const container = client.getContainerClient(process.env.AZURE_BLOB_CONTAINER)
            this.container = container;
        }
    }

    getContainer() {
        return this.container;
    }
}

const blobSingleton = new BlobSingleton();
export default blobSingleton;