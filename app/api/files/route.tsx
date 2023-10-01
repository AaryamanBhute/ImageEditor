import {NextResponse, NextRequest} from 'next/server';
import blobSingleton from '@/lib/blob';
import cosmosSingleton from '@/lib/cosmos';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest){
  const token = await getToken({req})

  if (!token || !token.uid){
    return NextResponse.json({message : "You couldn't be authenticated", type: "failure"}, { status: 401})
  }

  await cosmosSingleton.initialize();
  const cosmosClient = cosmosSingleton.getContainer();

  if (!cosmosClient) throw new Error("COSMOST CLIENT IS NULL");

  const querySpec = {
    query: `SELECT * FROM c WHERE c.userId = "${token.uid}"`,
  }

  const { resources } = await cosmosClient.items.query(querySpec).fetchAll();
  
  return NextResponse.json({message : "Successfully recieved data", type: "success", data : resources}, { status: 401})
}