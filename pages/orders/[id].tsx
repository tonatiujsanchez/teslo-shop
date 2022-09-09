import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';


import { Box, Card, CardContent, Divider, Grid, Link, Typography, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


interface Props {
    order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {
    

    return (
        <ShopLayout title="Resumen de la orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">Orden: { order._id }</Typography>
            {
                order.isPaid
                    ?<Chip
                            sx={{ my: 2 }}
                            label="Orden pagada"
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    :<Chip 
                        sx={{ my: 2 }}
                        label="Pendiente de pago"
                        variant='outlined'
                        color='error'
                        icon={ <CreditCardOffOutlined /> }
                    />
            }


            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList editable={false} products={ order.orderItems } />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos' : 'Producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{ order.shippingAddress.firstName } { order.shippingAddress.lastName }</Typography>
                            <Typography>{ order.shippingAddress.address } { order.shippingAddress.address2 ? `/ ${order.shippingAddress.address2}` : '' }</Typography>
                            <Typography>{ order.shippingAddress.city } - { order.shippingAddress.zip }</Typography>
                            <Typography>{ order.shippingAddress.country }</Typography>
                            <Typography>{ order.shippingAddress.phone }</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary orderValues={{
                                numberOfItems: order.numberOfItems,
                                subtotal: order.subtotal,
                                tax: order.tax,
                                total: order.total,
                            }} />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                {
                                    order.isPaid 
                                    ?(
                                        <Chip
                                            sx={{ my: 2 }}
                                            label="Orden pagada"
                                            variant='outlined'
                                            color='success'
                                            icon={<CreditScoreOutlined />}
                                        />
                                    )
                                    :(
                                        <Typography variant='h1'>Pagar</Typography>
                                    )
                                }


                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query 

    const session:any = await getSession({ req })

    if( !session ){
        return {
            redirect: {
                destination:`/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() )

    if( !order ){
        return {
            redirect: {
                destination:`/orders/history`,
                permanent: false
            }
        }
    }

    if( order.user !== session.user._id ){
        return {
            redirect: {
                destination:`/orders/history`,
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}

export default OrderPage