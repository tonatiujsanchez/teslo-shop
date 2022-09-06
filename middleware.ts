

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"

// import * as jose from 'jose';
// import { jwt } from './utils'; //NO funciona en la nueva version de Next

export async function middleware(req: NextRequest) {

// =============== PROTECCION DE RUTAS - NEXTAUTH ============ 

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { protocol, host, pathname } = req.nextUrl


    console.log({session});
    

    if (req.nextUrl.pathname.startsWith('/checkout')) {

        if(!session){            
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }

        return NextResponse.next()

    }

// =============== PROTECCION DE RUTAS - TRADICIONAL ============ 
    // const token = req.cookies.get('tesloshop_token')

    // if (req.nextUrl.pathname.startsWith('/checkout')) {

    //     const { protocol, host, pathname } = req.nextUrl
        
    //     if (!token) {            
    //         return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
    //     }

    //     try {
            
    //         await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))
    //         return NextResponse.next()

    //     } catch (error) {

    //         console.log(error)
    //         return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
    //     }

    // }




}


export const config = {
    matcher: [
        '/checkout/:path*',
    ]
}

// export const config = {
//     matcher: ['/checkout/address', '/checkout/summary']
// };