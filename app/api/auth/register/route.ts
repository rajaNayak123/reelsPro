import { NextRequest, NextResponse } from "next/server";
import { connectToMongodb } from "@/lib/db";
import User from "@/models/User.model";



export async function POST(request:NextRequest){
    try {
        const {email, password} = await request.json();
        
        if(!email || !password){
            return NextResponse.json(
                {error:"email and password are required"},
                {
                    status:400
                }
            )
        }

        await connectToMongodb();

       const exstingUser = await User.findOne({email})

       if(exstingUser){
            return NextResponse.json(
                {error:"Email is already exist"},
                {
                    status:400
                }
            )
       }

       await User.create({
        email,
        password
       })

       return NextResponse.json(
        {message:"User register successfully"},
        {
            status:201
        }
       )
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
            {message:" Failed while user register"},
            {
                status:500
            }
           )
    }
}