import {NextResponse, NextRequest} from 'next/server';
import blobSingleton from '@/lib/blob';
import cosmosSingleton from '@/lib/cosmos';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from "next-auth/jwt"
import { BlobSASPermissions, ContainerSASPermissions, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';
import { blob } from 'stream/consumers';

export async function POST(req: NextRequest){
  const token = await getToken({req})

  if (!token || !token.uid){
    return NextResponse.json({message : "You couldn't be authenticated", type: "failure"}, { status: 401})
  }

  await cosmosSingleton.initialize();
  const cosmosClient = cosmosSingleton.getContainer();

  if (!cosmosClient) throw new Error("COSMOST CLIENT IS NULL");

  const data = await req.json()

  const fileId = data.fileId


  const querySpec = {
    query: `SELECT * FROM c WHERE c.userId = "${token.uid}" AND c.id = "${fileId}"`,
  }

  const { resources } = await cosmosClient.items.query(querySpec).fetchAll();
  

  if (resources.length !== 1){
    return NextResponse.json({message : "Could not find file with that Id", type: "failure", data : null}, { status: 404})
  }

  await blobSingleton.initialize();
  const blobServiceClient = blobSingleton.getClient()
  const containerClient = blobSingleton.getContainer()
  
  if (!blobServiceClient) throw Error("NO BLOB SERVICE CLIENT")
  if (!containerClient) throw Error("NO CONTAINER CLIENT")
  
  const sasOptions = {
    containerName: containerClient.containerName,
    blobName: resources[0].id,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
    permissions: BlobSASPermissions.parse("r"),
  };

  if (!process.env.AZURE_ACCOUNT) throw Error("NO AZURE ACCOUNT NAME")
  if (!process.env.AZURE_KEY) throw Error("NO AZURE KEY")

  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_ACCOUNT,
    process.env.AZURE_KEY
  )

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  return NextResponse.json({message : "Successfully recieved data", type: "success", data : resources[0], url: `${containerClient.getBlockBlobClient(resources[0].id).url}?${sasToken}`}, { status: 200})
}