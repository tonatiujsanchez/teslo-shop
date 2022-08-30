import NextLink from 'next/link'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { useCart } from '../../hooks/useCart';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { FullScreenLoading } from '../../components/ui';

import { countries } from '../../utils';
import { useMemo } from 'react';


const SummaryPage = () => {

    const { numberOfItems, shippingAddress } = useCart()

    if( !shippingAddress ){
        return (
            <ShopLayout title="Resumen de la Compra" pageDescription="Resumen de la orden">
                <FullScreenLoading />
            </ShopLayout>
        )
    }

    const {  firstName, lastName, address, address2 = '', zip, city, phone } = shippingAddress

    const country = countries.find( country => country.code === shippingAddress?.country )

    return (
        <ShopLayout title="Resumen de la Compra" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">Resumen de la orden</Typography>

            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList editable={false} />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ( { numberOfItems } { numberOfItems > 1 ? 'Productos' : 'Producto' } )</Typography>
                            <Divider sx={{my:1}} />
                            
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href="/checkout/address" passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{ firstName }{' '}{ lastName }</Typography>
                            <Typography>{ address } { address2 ? `/ ${address2}` : '' }</Typography>
                            <Typography>{ city },{' '}{ zip }</Typography>
                            <Typography>{ country?.name }</Typography>
                            <Typography>{ phone }</Typography>

                            <Divider sx={{ my:1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt:3 }}>
                                <Button color='secondary' className='circular-btn' fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>  
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage