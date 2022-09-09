import { useEffect } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Box, Link, Typography } from '@mui/material'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'

import { ShopLayout } from '../../components/layouts/ShopLayout'
import { useCart } from '../../hooks'



const EmptyPage = () => {

    const { isLoaded, cart } = useCart()

    const router = useRouter()

    useEffect(()=>{
        if(isLoaded && cart.length > 0 ){
            router.replace('/cart')
        }
    },[isLoaded, cart, router])

    return (
        <ShopLayout title="Carrito vacio" pageDescription="No hay artículos en el carrito de compras">
            {
                isLoaded && cart.length === 0 &&
                <Box display="flex" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box display="flex" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} justifyContent="center" alignItems="center">
                            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                            <Typography>Su carrito esta vació</Typography>
                        </Box>
                        <NextLink href="/" passHref>
                            <Link typography="h5" color="secondary" sx={{marginTop: 4}}>Regresar</Link>
                        </NextLink>
                    </Box>
                </Box>
            }
        </ShopLayout>
    )
}

export default EmptyPage