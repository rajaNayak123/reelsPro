import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },

    {
        callbacks:{
            authorized:({token,req})=>{
               const {pathname} =  req.nextUrl // req provide nextUrl which is we can extract the url wich is user hit
                // allow auth related routes
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true;
                }
                // public routes
                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return true;
                }

                return !!token
            }
        }
    }
)

// where should be middleware run
export const config = {
    matcher:["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
}