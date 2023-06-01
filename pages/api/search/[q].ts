import type { NextApiRequest, NextApiResponse } from 'next'
import { db, dbProducts } from '../../../database'
import { Product } from '../../../models'

import { IProduct } from '../../../interfaces'

type Data =
    | { message: string }
    | {
        products: IProduct[]
        foundProducts: boolean
        query: string
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return searchProducts(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    let { q = '' } = req.query

    if (q.length === 0) {
        return res.status(400).json({
            message: 'Debe de especificar el termino de la búsqueda'
        })
    }

    q = q.toString().toLowerCase()

    try {
        
        await db.connect()

        let products = await Product.find({
            $text: { $search: q }
        })
        .select('title images price inStock slug -_id')
        .lean()
    
        const foundProducts:boolean = products.length > 0
    
        if(!foundProducts){
            products = await dbProducts.gelAllProducts()
        }else {
            products = products.map(( product )=> {
        
                product.images = product.images.map( image => {
                    return image.includes('http') ? image : `${ process.env.HOST_NAME }/products/${ image }`
                })
                return product
            })
        }
    
        await db.disconnect()    
    
        return res.status(200).json({
            products,
            foundProducts,
            query: q
        })

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}
