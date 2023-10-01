import {NextResponse, NextRequest} from 'next/server';
import blobSingleton from '@/lib/blob';
import cosmosSingleton from '@/lib/cosmos';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from "next-auth/jwt"

export async function GET(req: Request){
  return NextResponse.json({ message: 'Yo' })
}

export async function POST(req: NextRequest){
  const data = await req.formData()
  const files: File[] | null = data.getAll('files') as unknown as File[]
  
  const token = await getToken({req})

  if (!token || !token.uid){
    return NextResponse.json({message : "You couldn't be authenticated", type: "failure"}, { status: 401})
  }

  if (!files){
    return NextResponse.json({message : "No files found", type: "failure"}, { status: 400})
  }

  await blobSingleton.initialize();
  const blobClient = blobSingleton.getContainer();
  await cosmosSingleton.initialize();
  const cosmosClient = cosmosSingleton.getContainer();

  if (!blobClient) throw new Error("BLOB CLIENT IN NULL");
  if (!cosmosClient) throw new Error("COSMOST CLIENT IS NULL");

  await Promise.all(
    files.map(async (file)=>{
      try {
        const fileId = uuidv4()
        const blockBlobClient = blobClient.getBlockBlobClient(fileId);
        await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), { blobHTTPHeaders: { blobContentType: file.type } });
        const fileData = {
          id: fileId,
          userId: token.uid,
          fileName: file.name,
          type: file.type,
          size: file.size,
          url: blockBlobClient.url,
          uploadedOn: Date.now()
        }
        const {resource: createdFileData} = await cosmosClient.items.create(
          fileData
        )
      } catch (err) {
          console.error(err);
      }
    })
  )

  return NextResponse.json({success : true})
}