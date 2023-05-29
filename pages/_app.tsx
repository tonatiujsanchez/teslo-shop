import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { SWRConfig } from 'swr'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"


import { lightTheme } from '../themes'

import { AuthProvider } from '../context/auth'
import { CartProvider } from '../context/cart'
import { UIProvider } from '../context/ui'

function MyApp({ Component, pageProps }: AppProps) {
    return (

        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
            <SWRConfig value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}>
                <AuthProvider>
                    <CartProvider>
                        <UIProvider>
                            <ThemeProvider theme={lightTheme}>
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </UIProvider>
                    </CartProvider>
                </AuthProvider>
            </SWRConfig>
        </PayPalScriptProvider>
)
}

export default MyApp
