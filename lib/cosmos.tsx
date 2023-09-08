import { Database, Container, CosmosClient } from "@azure/cosmos";

class CosmosSingleton {
    database: Database | null;
    container: Container | null;
    constructor() {
        this.database = null;
        this.container = null;
    }

    async initialize() {
        if (!this.database || !this.container) {
        const databaseName = process.env.AZURE_COSMOS_DATABASE;
        const containerName = process.env.AZURE_COSMOS_CONTAINER;
        if (!databaseName || !containerName) throw new Error("NO DATABASE OR CONTAINER SPECIFIED")
        if (!process.env.AZURE_COSMOS_CONNECTION_STRING) throw new Error("NO COSMOS CONNECTION STRING SPECIFIED")
        
        const client = new CosmosClient(process.env.AZURE_COSMOS_CONNECTION_STRING);
        const database = client.database(databaseName);
        const container = database.container(containerName);
        this.database = database;
        this.container = container;
        }
    }

    getContainer() {
        return this.container;
    }
}

const cosmosSingleton = new CosmosSingleton();
export default cosmosSingleton;