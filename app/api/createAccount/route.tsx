import {NextResponse, NextRequest} from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import authenticationTable from '@/lib/authentication';
import { RestError } from '@azure/data-tables';

export async function GET(req: NextRequest){
  return NextResponse.json({ message: 'Yo' })
}

export async function POST(req: NextRequest){
    await authenticationTable.initialize();
    const data = await req.formData();
    const table = authenticationTable.getTable();

    const username = data.get("username")?.toString()
    const password = data.get("password")?.toString()
    const email = data.get("email")?.toString()
    const alerts = data.get("subscribeToAlerts")?.toString()

    if (!username) throw new Error("username is null")
    if (!password) throw new Error("password is null")

    var saltRounds = 10;

    const newEntity = {
      partitionKey: "authentication",
      rowKey: username,
      id: uuidv4(),
      username: username,
      password: bcrypt.hashSync(password, saltRounds),
      email: email,
      alertsOn: alerts === "on"
    };
    
    try{
      await table?.createEntity(newEntity)
    }
    catch (error : any) {
      if (error.statusCode !== 409) throw error

      return NextResponse.json({message : "Username already exists", type: "failure"}, {status: 409})
    }

    return NextResponse.json({message : "Account created successfully", type: "success"}, { status: 200})
}