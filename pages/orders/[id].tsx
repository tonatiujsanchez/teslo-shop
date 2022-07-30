import NextLink from 'next/link'
import { ShopLayout } from '../../components/layouts';
import { Box, Card, CardContent, Divider, Grid, Link, Typography, Chip } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';


const OrderPage = () => {
    return (
        <ShopLayout title="Resumen de la orden 123165465" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">Orden: 2653ABC</Typography>

            {/* <Chip 
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant='outlined'
                color='error'
                icon={ <CreditCardOffOutlined /> }
            /> */}
            <Chip
                sx={{ my: 2 }}
                label="Orden pagada"
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList editable={false} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href="/checkout/address" passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>Tonatiuj Sánchez</Typography>
                            <Typography>3254 Calle y Colonia conocidos</Typography>
                            <Typography>Tlapa de Comonfort, Guerrero</Typography>
                            <Typography>México</Typography>
                            <Typography>+52 254 252 36 58</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Typography variant='h1'>Pagar</Typography>

                                <Chip
                                    sx={{ my: 2 }}
                                    label="Orden pagada"
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default OrderPage