import { useState } from 'react';

import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'

import { Box, Button, Chip, Grid, Typography } from "@mui/material"


import { dbProducts } from "../../database"

import { ShopLayout } from "../../components/layouts"
import { ProductSizeSelector, ProductSlideshow } from "../../components/products"
import { ItemCounter } from "../../components/ui"

import { ICartProduct, IProduct, ISize } from "../../interfaces"
import { useRouter } from 'next/router';
import { useCart } from '../../hooks';


interface Props {
    product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

    const router = useRouter()
    const [showMessage, setShowMessage] = useState(false)

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    })

    const { addNewProductToCart } = useCart()

    const onSelectedSize = ( selectedSize: ISize ) => {

        setTempCartProduct({
            ...tempCartProduct,
            size: selectedSize
        })

        setShowMessage(false)
        
    }
    
    const onUpdatedQuantiry = ( selectedQuantiry:number ) => {
        setTempCartProduct({
            ...tempCartProduct,
            quantity: selectedQuantiry
        })
    }

    const onAddProductToCart = () => {

        if( !tempCartProduct.size ){
            setShowMessage(true)
            return
        }

        addNewProductToCart( tempCartProduct )
        // router.push('/cart')
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={product.images} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        {/* Titulos */}
                        <Typography variant="h1" component="h1">
                            {product.title}
                        </Typography>
                        <Typography variant="subtitle1" component="h2">{`${product.price}`}</Typography>
                        {/* Cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2">Cantidad</Typography>

                            <ItemCounter 
                                currentValue = { tempCartProduct.quantity }
                                maxValue = { product.inStock }
                                onUpdatedQuantiry = {onUpdatedQuantiry}
                            />
                            
                            <ProductSizeSelector 
                                selectedSize={ tempCartProduct.size } 
                                sizes={product.sizes}
                                onSelectedSize={onSelectedSize} 
                            />
                        </Box>

                        {/* Agregar al carrito */}
                        {
                            showMessage &&
                            <Typography color='red' variant="body2">Seleciones una talla</Typography>
                        }
                        {
                            product.inStock > 0
                                ? (
                                    <Button 
                                        color="secondary" 
                                        className="circular-btn"
                                        onClick={onAddProductToCart}
                                    >
                                        { tempCartProduct.size
                                            ? 'Agregar al carrito'
                                            : 'Seleccione una talla'
                                        }
                                    </Button>
                                )
                                : (
                                    <Chip label="No hay disponibles" color="error" variant="outlined" />
                                )
                        }
                        {/* Descripción */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2">Dscripcion</Typography>
                            <Typography variant="body2">{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}



// ------- Serve Side Render --------
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//     const { slug='' } = params as { slug: string }

//     const product = await dbProducts.getProductBySlug(slug)


//     if( !product ){
//         return{
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
//             product
//         }
//     }
// }




// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async () => {

    const slugs = await dbProducts.getAllProductSlugs()

    const paths = slugs.map(slug => ({ params: { slug: slug.slug } }))

    return {
        paths,
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string }

    const product = await dbProducts.getProductBySlug(slug)

    if (!product) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            product
        },
        revalidate: 86400 // 60s * 60m * 24h 
    }
}

export default ProductPage