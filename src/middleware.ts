import { NextRequest, NextResponse } from "next/server";
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import isAuthenticated from "@/helpers/auth/isAuthenticated";
import routes from "./helpers/routes/redirectIfAuthenticatedRoutes";

export default async function middleware(req : NextRequest, res : NextResponse){

    const API_URL = process.env.API_URL;   
    const path = req.nextUrl.pathname;

    // const {user, setUser} = useContext(UserContext);

    try {

        const response = await isAuthenticated(API_URL, req.cookies.get('__SESS_TOKEN')?.value);

        // auth middleware
        if (path.match(/^(\/play(\/{1}\w+)*)$/) || path.match(/^(\/profile(\/{1}\w+)*)$/) || path.match(/^(\/premium(\/{1}\w+)*)$/) ){
            if (response.code === 401){
                return NextResponse.redirect(new URL('/login', req.url));           
            }        
        }        




        const premiumVerificationResponse = await fetch(API_URL + '/auth/fe-auth/premium', {
            method : "GET",
            credentials : 'include',
            headers : {
                Cookie : `__SESS_TOKEN=${req.cookies.get('__SESS_TOKEN')?.value}`
            }
        });

        const premiumVerificationParsedResponse = await premiumVerificationResponse.json();
        console.log(premiumVerificationParsedResponse, 'ww');

        // premium middleware (prevent premium user from buying twice)
        if (path.match(/^(\/premium(\/{1}\w+)*)$/)){
            if (premiumVerificationParsedResponse.code == 200) {
                return NextResponse.redirect(new URL('/', req.url));      
            }
        }

        // premium middleware (prevent free user from accessing premium pages)
                




    } catch (err ){}


    // route authentication
    // /play/:path




    return NextResponse.next();    
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|logo).*)',
    ]
}