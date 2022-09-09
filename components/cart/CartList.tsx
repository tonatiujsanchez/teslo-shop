import { FC } from 'react';

import NextLink from 'next/link'

import { Grid, Link, Typography, Card, CardActionArea, CardMedia, Box, Button } from '@mui/material';

import { useCart } from '../../hooks/useCart'

import { ItemCounter } from '../ui';

import { ICartProduct } from '../../interfaces';
import { IOrderItem } from '../../interfaces';



interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useCart()

    const onUpdatedQuantiry = ( product: ICartProduct, newQuantiry: number ) => {
        product.quantity = newQuantiry
        updateCartQuantity(product)
    }

    const productsToShow = products ? products : cart

    return (
        <>
            {
                productsToShow.map( product => {

                    return (
                        <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug + product.size}>
                            <Grid item xs={3}>
                                <NextLink href={`/product/${ product.slug }`} passHref>
                                    <Link>
                                        <CardActionArea>
                                            <CardMedia
                                                image={`/products/${product.image}`}
                                                component="img"
                                                sx={{ borderRadius: '5px' }} />
                                        </CardActionArea>
                                    </Link>
                                </NextLink>
                            </Grid>
                            <Grid item xs={7}>
                                <Box display="flex" flexDirection="column">
                                    <Typography variant='body1'>{product.title}</Typography>
                                    <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                                    {
                                        editable
                                            ? <ItemCounter 
                                                currentValue={ product.quantity } 
                                                maxValue={ 10 } 
                                                onUpdatedQuantiry={ (selectedQuantiry) =>{
                                                    onUpdatedQuantiry( product as ICartProduct, selectedQuantiry )
                                                }}                                                
                                             />
                                            : <Typography>Cantidad: <strong>{product.quantity}</strong></Typography>
                                    }

                                </Box>
                            </Grid>
                            <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
                                <Typography>{`$${product.price}`}</Typography>
                                {
                                    editable &&
                                    <Button
                                        onClick={ ()=> removeCartProduct( product as ICartProduct ) }
                                        variant='text'
                                        color='secondary'
                                    >
                                        Remover
                                    </Button>
                                }

                            </Grid>
                        </Grid>
                    )
                })
            }
        </>
    )
}
