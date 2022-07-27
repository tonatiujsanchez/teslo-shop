import Head from "next/head"
import { FC, ReactNode } from "react"
import { Navbar } from "../ui"

interface Props {
    children?: ReactNode
    title: string
    pageDescription: string
    imageFullUrl?: string
}

export const ShopLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={ pageDescription } />


                <meta name="og:title" content={ title } />
                <meta name="og:description" content={ pageDescription } />
                {
                    imageFullUrl && (
                        <meta name="og:image" content={ imageFullUrl } />
                    )
                }
            </Head>
            <nav>
                <Navbar />
            </nav>
            {/* TODO: Siderbar */}
            <main style={{
                margin: '80px 0',
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
