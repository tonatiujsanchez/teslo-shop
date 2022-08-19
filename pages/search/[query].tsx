import type { NextPage, GetServerSideProps } from 'next'

import { Box, Typography } from '@mui/material'

import { dbProducts } from '../../database'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'

import { IProduct } from '../../interfaces'


interface Props {
    products: IProduct[]
    foundProducts: boolean
    query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de teslo aqui'}>
            <Typography variant='h1' component='h1'>Buscar producto</Typography>
            {
                foundProducts
                ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">resultados de: { query }</Typography>
                :
                <>
                    <Box display='flex' gap={1}>
                        <Typography variant='h2' sx={{ mb: 1 }}>No se encontraron productos con:</Typography>
                        <Typography variant='h2' sx={{ mb: 1 }} color='secondary' textTransform="capitalize">{ query }</Typography>
                    </Box>
                    <Typography variant='h2' sx={{ mb: 2, mt: 5 }}>Quizas te interecen estos productos</Typography>
                </> 
                
            }
            


            <ProductList products={products} />
            
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query } = params as { query: string }

    if(query.length === 0){
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query)
    const foundProducts:boolean = products.length > 0

    // retornar otros productos
    if(!foundProducts){
        products = await dbProducts.gelAllProducts()
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}


export default SearchPage
