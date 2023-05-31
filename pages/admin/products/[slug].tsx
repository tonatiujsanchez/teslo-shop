import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

import { ProductForm } from '../../../components/products';
import { FullScreenLoading } from '../../../components/ui';

import { IProduct } from '../../../interfaces';


const ProductAdminPage:FC = () => {

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<IProduct>()

    const router = useRouter()
    const { slug } = router.query


    const loadProduct = async() => {

        try {
            setLoading(true)
            const { data } = await axios.get(`/api/admin/getProductBySlug?slug=${ slug }`)
            setLoading(false)

            setProduct(data)
            
        } catch (error) {
            router.replace('/admin/products')
        }
        
    }

    useEffect(()=>{
        if( slug ){
            loadProduct()
        }
    },[slug])


    if( loading || !product ) return ( <FullScreenLoading /> ) 

    return (
        <ProductForm product={ product } />
    )
}


export default ProductAdminPage