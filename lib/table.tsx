import { TableClient, TableServiceClient, AzureNamedKeyCredential } from "@azure/data-tables";

class TableSingleton {
    database: TableServiceClient | null;
    account: string | null;
    credential: AzureNamedKeyCredential | null;
    
    constructor() {
        this.account= null;
        this.credential = null;
        this.database = null;
    }

    async initialize() {
        if (!this.database) {
            const account = process.env.AZURE_ACCOUNT || "";
            this.account = account
            const accountKey = process.env.AZURE_KEY || "";
            const credential = new AzureNamedKeyCredential(account, accountKey);
            this.credential = credential;
            const serviceClient = new TableServiceClient( `https://${account}.table.core.windows.net`, credential);
            this.database = serviceClient;
        }
    }

    getDatabase() {
        return this.database;
    }

    getTable(tableName : string){
        if (!this.credential) throw new Error("Invalid Credential") 
        const client = new TableClient(`https://${this.account}.table.core.windows.net`, tableName, this.credential);
        return client
    }
}

const tableSingleton = new TableSingleton();
export default tableSingleton;