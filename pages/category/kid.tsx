import { NextPage } from 'next'

import { Typography } from '@mui/material'

import { useProducts } from '../../hooks'

import { ShopLayout } from '../../components/layouts'
import { FullScreenLoading } from '../../components/ui'

import { ProductList } from '../../components/products'


const KidPage: NextPage = () => {


    const { products, isLoading } = useProducts('/products?gender=kid')

    return (
        <ShopLayout title={'Teslo-Shop - Kid'} pageDescription={'Encuentra los mejores productos de teslo para niños y niñas'}>
            <Typography variant='h1' component='h1'>Niños/Niñas</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Productos para Niñ@s</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout>

    )
}

export default KidPage