import { useEffect, useState } from 'react';

import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js'

import { Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined, Person, LockOpen } from '@mui/icons-material';
import axios from 'axios';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { FullScreenLoading } from '../../components/ui';

import { tesloApi } from '../../apis';
import { IOrder, IPaypal } from '../../interfaces';


const OrderPage:NextPage = () => {

    const [isPaying, setIsPaying] = useState(false)
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
            router.replace('/orders/history')
        }
        
    }



    useEffect(() => {
        if( id ){ 
            loadOrder()
        }
    }, [id])
    
    

    if( loading || !order ) return ( <FullScreenLoading /> ) 
    
    const { shippingAddress } = order


    const onOrderCompleted = async( details:IPaypal.OrderResponseBody ) => {
        if( details.status !== 'COMPLETED' ){
            return alert('No hay pago en Paypal')
        }

        setIsPaying(true)

        try {

            const { data } = await tesloApi.post('/orders/pay', {
                transactionId: details.id,
                orderId: order._id,
            })
            
            router.reload()
        } catch (error) {
            setIsPaying(false)
            console.log(error)
            alert('Hubo un Error inesperado')
        }
    }
    

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
                                    !isPaying
                                    ?(
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
                                                <>
                                                    <PayPalButtons
                                                        createOrder={(data, actions) => {
                                                            
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {   
                                                                        amount: {
                                                                            value: (order.total).toString(),
                                                                        },
                                                                    },
                                                                ],
                                                            });
                                                        }}
                
                                                        onApprove={(data, actions) => {
                                                            
                                                            return actions.order!.capture().then((details) => {
                                                                onOrderCompleted( details )
                                                            });
                                                        }}
                                                    />
                                                    <Box>
                                                        <Chip 
                                                            sx={{ mt: 2, mb:1, width:'100%' }}
                                                            label="Usuario de prueba: sb-bqzyo20564624@personal.example.com"
                                                            variant='outlined'
                                                            icon={ <Person /> }
                                                        />
                                                        <Chip 
                                                            sx={{ width:'100%' }}
                                                            label="Password: 123456789"
                                                            variant='outlined'
                                                            icon={ <LockOpen /> }
                                                        />
                                                    </Box>
                                                </>
                                            )

                                       
                                    )
                                    :<Box display="flex" justifyContent="center" className='fadeId' >
                                        <CircularProgress />
                                    </Box>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export default OrderPage