

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"

import * as jose from 'jose';
// import { jwt } from './utils'; //NO funciona en la nueva version de Next

export async function middleware( req: NextRequest ) {

// =============== PROTECCION DE RUTAS - NEXTAUTH ============ 

    // const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    // const { protocol, host, pathname } = req.nextUrl
    

    // if (req.nextUrl.pathname.startsWith('/checkout')) {

    //     if(!session){            
    //         return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
    //     }
    //     return NextResponse.next()
    // }



    // if (req.nextUrl.pathname.startsWith('/admin') ) {
    //     if(!session){            
    //         return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
    //     }

    //     const validRoles = ['admin']

    //     if( !validRoles.includes( session.user.role )){
    //         return NextResponse.redirect(`${protocol}//${host}`)
    //     }

    //     return NextResponse.next()
    // }



    // if (req.nextUrl.pathname.startsWith('/api/admin')) {

    //     if(!session){            
    //         return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
    //     }
        
    //     const validRoles = ['admin']

    //     if( !validRoles.includes( session.user.role ) ){
    //         return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
    //     }
    //     return NextResponse.next()
    // }


// =============== PROTECCION DE RUTAS - TRADICIONAL ============ 
    const token = req.cookies.get('tesloshop_token')

    if (req.nextUrl.pathname.startsWith('/checkout')) {

        const { protocol, host, pathname } = req.nextUrl
        
        if (!token) {            
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }

        try {
            
            await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.next()

        } catch (error) {

            console.log(error)
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }
    }


    if (req.nextUrl.pathname.startsWith('/admin') ) {

        const { protocol, host, pathname } = req.nextUrl
        
        if (!token) {            
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }

        try {

          const { payload } = await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))

          if(payload.role !== 'admin'){
            return NextResponse.redirect(`${protocol}//${host}`)
          }

          return NextResponse.next()

            
        } catch (error) {
            console.log(error)
            return NextResponse.redirect(`${protocol}//${host}`)
        }
    }

    if (req.nextUrl.pathname.startsWith('/api/admin')) {
                
        if (!token) {            
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
        }

        try {

          const { payload } = await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))

          if(payload.role !== 'admin'){
                return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
          }

          return NextResponse.next()
            
        } catch (error) {
            console.log(error)
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
        }        
    }


}


export const config = {
    matcher: [
        '/checkout/:path*',
        '/admin/:path*',
        '/api/admin/:path*',
        '/((?!api\/)/admin/:path.*)'
    ]
}










