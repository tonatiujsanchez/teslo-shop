import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

import { tesloApi } from '../../apis'
import { IProduct } from '../../interfaces'


const SearchPage: NextPage = () => {

    const [products, setProducts] = useState<IProduct[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [foundProducts, setFoundProducts] = useState(true)

    const router = useRouter()
    const { query } = router.query

    
    const loadProducts = async() => {
        
        setLoadingProducts(true)
        const { data } = await tesloApi(`/search/${query}`)
        setLoadingProducts(false)

        setProducts(data.products)
        setFoundProducts(data.foundProducts)
    }

    useEffect(()=> {
        if( query ){
            loadProducts()
        }
    },[query])


    if( loadingProducts || !query ){
        return <FullScreenLoading />
    }

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


export default SearchPage
