import {NextResponse } from 'next/server';
import authenticationTable from '@/lib/authentication';
import bcrypt from 'bcrypt'
import { TableEntity } from '@azure/data-tables';

export async function GET(req: Request){
  return NextResponse.json({ message: 'Yo' })
}

export async function POST(req: Request){
  await authenticationTable.initialize();
  const table = authenticationTable.getTable();

  const data = await req.json()

  const username = data.username
  const password = data.password

  if (!password) return NextResponse.json({message : "Something went wrong with your password", type: "failure"}, { status: 400})
  if (!username) return NextResponse.json({message : "Something went wrong with your username", type: "failure"}, { status: 400})
  
  var entity : any = null;
  try{
    entity = await table?.getEntity("authentication", username)
  }
  catch(error : any){
    if (error.statusCode === 404) return NextResponse.json({message : "Whoops! No account with that username", type: "failure"}, { status: 404})
    return NextResponse.json({message : "Whoops! Something Went Wrong", type: "failure"}, { status: 501})
  }

  if (!await bcrypt.compare(password, entity.password)) return NextResponse.json({message : "Something went wrong with your username", type: "failure"}, { status: 401}) 

  return NextResponse.json(
    {
      name : entity.username,
      email: entity.email,
      id: entity.id,
    }
  , { status: 200})
}