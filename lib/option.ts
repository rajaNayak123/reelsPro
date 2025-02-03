import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongodb } from "./db";
import User from "@/models/User.model";
import bcrypt from "bcrypt"
export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email:{label: "Email",type:"text"},
                password:{label:"Password", type:"text"}
            },
            async authorize(credentials){

                if(!credentials?.email || !credentials?.password){
                    throw new Error("Email or password not provided")
                }

                try {
                    await connectToMongodb();

                   const user = await User.findOne({email: credentials.email})

                   if(!user){
                    throw new Error("User not found")
                   }

                  const isValidPassword =  await bcrypt.compare(credentials.password, user.password);

                  if(!isValidPassword){
                    throw new Error("Password is incorrect")
                  }

                  return{
                    id: user._id.toString(),
                    email: user.email
                  }
                } catch (error) {
                    console.log("Error in authOption",error);
                    throw error
                }
            },
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session,token}){ // it gives two things session and through the session also access token
            if(session.user){
                session.user._id = token.id as string
            }
            return session
        } 
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret:process.env.NEXTAUTH_SECRET
};
