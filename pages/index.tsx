import { Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { initialData } from '../database/products'



const Home: NextPage = () => {
    return (
        <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de teslo aqui'}>
            <Typography variant='h1' component='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{mb: 1}}>Todos los productos</Typography>


            <Grid container spacing={4}>
                <ProductList products={initialData.products as any} />
            </Grid>
        </ShopLayout>
    )
}

export default Home
