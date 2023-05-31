import { useEffect, useState } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router';

import { Box, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import axios from 'axios';

import { AdminLayout } from '../../../components/layouts';
import { CartList, OrderSummary } from '../../../components/cart';

import { IOrder } from '../../../interfaces';
import { FullScreenLoading } from '../../../components/ui';


const OrderPage:NextPage = () => {

    const [order, setOrder] = useState<IOrder>()
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const { id } = router.query

    const loadOrder = async() => {

        try {
            setLoading(true)
            const { data } = await axios.get(`/api/orders/getOrderById?idOrder=${ id }`)
            setLoading(false)
            setOrder(data)
            
        } catch (error) {
            router.replace('/admin/orders')
        }
        
    }

    useEffect(() => {
        if( id ){ 
            loadOrder()
        }
    }, [id])
    

    if( loading || !order ) return ( <FullScreenLoading /> ) 

    const { shippingAddress } = order

    
    return (
        <AdminLayout title="Resumen de la orden" subtitle={`Resumen de la orden: ${order._id}`} icon={<AirplaneTicketOutlined />}>
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

                            <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                            <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `/ ${shippingAddress.address2}` : '' }</Typography>
                            <Typography>{ shippingAddress.city } - { shippingAddress.zip }</Typography>
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>

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
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden pendiente"
                                                variant='outlined'
                                                color='error'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )                                       
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}



export default OrderPage