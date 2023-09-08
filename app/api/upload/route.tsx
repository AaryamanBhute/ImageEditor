import {NextResponse } from 'next/server';
import blobSingleton from '@/lib/blob';
import cosmosSingleton from '@/lib/cosmos';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request){
  return NextResponse.json({ message: 'Yo' })
}

export async function POST(req: Request){
  const data = await req.formData()
  const files: File[] | null = data.getAll('files') as unknown as File[]

  console.log(files)

  if (!files){
    return NextResponse.json({success : false})
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
        const blockBlobClient = blobClient.getBlockBlobClient(file.name);
          await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), { blobHTTPHeaders: { blobContentType: 'image/png' } });
          const fileData = {
            id: uuidv4(),
            userId: uuidv4(),
            fileName: file.name,
            contentType: file.type,
          }

          const {resource: createdFileData} = await cosmosClient.items.create(
            fileData
          )

          console.log(`File uploaded successfully: ${file.name}`);
      } catch (err) {
          console.error(err);
      }

    })
  )

  return NextResponse.json({success : true})
}