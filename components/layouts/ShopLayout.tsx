import Head from "next/head"
import { FC, ReactNode } from "react"
import { Navbar, SideMenu } from "../ui"

interface Props {
    children?: ReactNode
    title: string
    pageDescription: string
    imageFullUrl?: string
    ogType?: string
    ogUrl?: string
}

export const ShopLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl, ogType='website', ogUrl=`${process.env.NEXT_PUBLIC_HOST_NAME}` }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={ pageDescription } />
                <meta name="keywords" content="Ecommerce, Teslo, Shop"/>
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Tonatiuj Sánchez" />

                <meta name="og:title" content={ title } />
                <meta name="og:description" content={ pageDescription } />
                {
                    imageFullUrl && (
                        <>
                            <meta name="og:image" content={ imageFullUrl } />
                            <meta property="og:image" content={ imageFullUrl } />
                            <meta name="twitter:image" content={ imageFullUrl } />
                        </>
                    )
                }

                <meta property="og:title" content={ title } />
                <meta property="og:description" content={ pageDescription }/>
                <meta property="og:type" content={ ogType } />
                <meta property="og:url" content={ ogUrl } />

                <meta property="og:locale" content="es_MX" />
                <meta property="og:site_name" content="Teslo Shop" />

                <meta name="twitter:title" content={ title } />
                <meta name="twitter:description" content={ pageDescription } />
                <meta name="twitter:url" content={ ogUrl } />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@tonatiujsanchez" />
                <meta name="twitter:creator" content="@tonatiujsanchez" />

            </Head>
            <nav>
                <Navbar />
            </nav>
            
            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px'
            }}>
                { children }
            </main>


            {/* TODO: footer */}
            <footer></footer>
        </>
    )
}
