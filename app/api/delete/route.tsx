import {NextResponse, NextRequest} from 'next/server';
import blobSingleton from '@/lib/blob';
import { DeleteSnapshotsOptionType } from '@azure/storage-blob';
import cosmosSingleton from '@/lib/cosmos';
import { getToken } from "next-auth/jwt"

async function validateOwnership(fileId : string, userId : any){
  await cosmosSingleton.initialize();
  const cosmosClient = cosmosSingleton.getContainer();

  if (!cosmosClient) return false

  const querySpec = {
    query: `SELECT * FROM c WHERE c.id = "${fileId}"`,
  }

  const { resources } = await cosmosClient.items.query(querySpec).fetchAll();

  if (resources.length !== 1){
    return "NO ENTRY EXISTS"
  }

  const file = resources[0]

  if (file.userId !== userId) return false

  return true
}

async function deleteFromCosmos(fileId : string, userId : any){
  await cosmosSingleton.initialize();
  const cosmosClient = cosmosSingleton.getContainer();

  if (!cosmosClient) return null

  const response = await cosmosClient.item(fileId, userId).delete()

  console.log(response)

  return true
}

async function deleteFromBlob(fileId : string){
  await blobSingleton.initialize()
  const blobContainer = blobSingleton.getContainer()

  if (!blobContainer) return null
  
  const blobClient = blobContainer.getBlobClient(fileId)

  const options = {
    deleteSnapshots: "include" as DeleteSnapshotsOptionType
  }
  
  const response = await blobClient.deleteIfExists(options)

  console.log(response)

  return response
}

export async function POST(req: NextRequest){
  const token = await getToken({req})

  if (!token || !token.uid){
    return NextResponse.json({message : "You couldn't be authenticated", type: "failure"}, { status: 401})
  }  

  const data = await req.json()

  const fileId = data.fileId
  const userId = token.uid

  if (!validateOwnership(fileId, userId)) return NextResponse.json({message : "You are not the owner of this resource", type: "failure"}, { status: 403})

  const blobResult = await deleteFromBlob(fileId)

  if (blobResult?.succeeded || blobResult?._response.status == 404){
    await deleteFromCosmos(fileId, userId)
    return NextResponse.json({message : "File deleted", type: "success"}, { status: 200})
  }

  return NextResponse.json({message : "Something went wrong", type: "failure"}, { status: 500})
}