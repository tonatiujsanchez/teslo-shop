import { useEffect, useState } from 'react';
import NextLink from 'next/link'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';

import { useCart } from '../../hooks/useCart';

import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { FullScreenLoading } from '../../components/ui';

import { countries } from '../../utils';
import Cookies from "js-cookie";
import { useRouter } from 'next/router';


const SummaryPage = () => {

    const router = useRouter()
    const { isLoaded, numberOfItems, shippingAddress, createOrder } = useCart()

    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    
    useEffect(()=>{
        if( isLoaded && numberOfItems <= 0 ){
            router.push('/cart/empty')
        }
    },[])

    useEffect(()=>{

        if( !Cookies.get('tesloshop_firstName') ){
            router.push('/checkout/address')
        }
    },[router])



    if( !shippingAddress ){
        return (
            <ShopLayout title="Resumen de la Compra" pageDescription="Resumen de la orden">
                <FullScreenLoading />
            </ShopLayout>
        )
    }

    const {  firstName, lastName, address, address2 = '', zip, city, phone } = shippingAddress

    const country = countries.find( country => country.code === shippingAddress?.country )


    const onCreateOrder = async() => {

        setIsPosting(true)

        const { hasError, message } = await createOrder()

        if (hasError) {
            setIsPosting(false)
            setErrorMessage( message )
            return
        }

        router.replace(`/orders/${ message }`)

    }

    return (
        <ShopLayout title="Resumen de la Compra" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1" sx={{ mb: 2 }}>Resumen de la orden</Typography>

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

                            <Box sx={{ mt:3 }} display="flex" flexDirection="column">
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrder }
                                    disabled={ isPosting }
                                >
                                    Confirmar Orden
                                </Button>
                                <Chip
                                    color="error"
                                    label={ errorMessage }
                                    sx={{ display: errorMessage ? 'flex': 'none', mt: 1 }}
                                />
                            </Box>  
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage