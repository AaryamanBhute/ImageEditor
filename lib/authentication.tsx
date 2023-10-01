import tableSingleton from "./table";

import { TableClient, TableServiceClient, AzureNamedKeyCredential } from "@azure/data-tables";

class AuthenticationTable {
    table: TableClient | null;
    
    constructor() {
        this.table = null;
    }

    async initialize() {
        if (!this.table){
            await tableSingleton.initialize();
            this.table = tableSingleton.getTable("AuthenticationData");
        }
    }

    getTable(){
        return this.table
    }
}

const authenticationTable = new AuthenticationTable();
export default authenticationTable;