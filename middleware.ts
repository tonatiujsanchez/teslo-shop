

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose';
// import { jwt } from './utils'; //NO funciona en la nueva version de Next

export async function middleware(req: NextRequest) {

    const token = req.cookies.get('tesloshop_token')

    if (req.nextUrl.pathname.startsWith('/checkout')) {

        const { protocol, host, pathname } = req.nextUrl
        console.log({ protocol, host, pathname });
        
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

}


export const config = {
    matcher: [
        '/checkout/:path*',
    ]
}