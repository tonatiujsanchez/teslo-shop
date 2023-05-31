import type { NextApiRequest, NextApiResponse } from 'next'

import { IProduct } from '../../../interfaces'
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = 
    | { message: string }
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getProductBySlug( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


const getProductBySlug = async( req:NextApiRequest, res:NextApiResponse<Data> ) => {

    const { slug = '' } = req.query as { slug: string } 
    
    if( slug.trim() === '' ){
        return res.status(400).json({ message: 'Slug requerido' })
    }
    
    try {
        
        await db.connect()
        const product = await Product.findOne({ slug }).lean()
        await db.disconnect()

        if( !product ){
            return res.status(400).json({ message: 'Producto no encontrado' })
        }

        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/products/${ image }`
        })

        return res.status(200).json(product)

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}

