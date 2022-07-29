import NextLink from 'next/link'
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';



const EmptyPage = () => {
    return (
        <ShopLayout title="Carrito vacio" pageDescription="No hay artículos en el carrito de compras">
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
        </ShopLayout>
    )
}

export default EmptyPage