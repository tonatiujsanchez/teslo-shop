import { useState } from 'react';

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js'
import { isValidObjectId } from 'mongoose';
import useSWR from 'swr';

import { Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { FullScreenLoading } from '../../components/ui';

import { tesloApi } from '../../apis';
import { IOrder, IPaypal } from '../../interfaces';


interface Props {
    orderId: string
}

const OrderPage:NextPage<Props> = ({ orderId }) => {

    const [isPaying, setIsPaying] = useState(false)
    const router = useRouter()
    
    const { data:order, error } = useSWR<IOrder>(`/api/orders/getOrderById?idOrder=${ orderId }`)

    if( !order && !error ) return ( <FullScreenLoading /> ) 
    if( !order ) return ( <FullScreenLoading /> ) 


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


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query

    if ( !isValidObjectId(id)) {            
        return {
            redirect: {
                destination:`/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            orderId: id
        }
    }
}

export default OrderPage