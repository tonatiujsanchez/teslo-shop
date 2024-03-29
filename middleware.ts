

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import * as jose from 'jose';


export async function middleware( req: NextRequest ) {


// =============== PROTECCION DE RUTAS - TRADICIONAL ============ 
    const token = req.cookies.get('tesloshop_token')


    if( req.nextUrl.pathname.startsWith('/auth') ){

        const { protocol, host, pathname } = req.nextUrl

        try {
            await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.redirect(`${protocol}//${host}`)
        } catch (error) {
            return NextResponse.next()
        }
    }

    if (
        req.nextUrl.pathname.startsWith('/checkout') ||
        req.nextUrl.pathname.startsWith('/orders')
    ) {

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

    if (req.nextUrl.pathname.startsWith('/api/orders')) {
                
        if (!token) {            
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
        }

        try {

          await jose.jwtVerify(token as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED))
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
        '/orders/:path*',  //Proteger la API de orders
        '/auth/:path*',

        '/admin/:path*',
        '/api/admin/:path*',
        '/api/orders/:path*',

        '/((?!api\/)/admin/:path.*)'
    ]
}










