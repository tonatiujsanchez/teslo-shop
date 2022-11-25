import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'
import { isValidObjectId } from 'mongoose';

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res ) 

        case 'PUT':
            return updateProduct( req, res )

        case 'POST':
            return 
    
        default:
            return res.status(400).json({ message: 'Endpoint NO existe' })
    }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect()
    const products = await Product.find().sort({ title: 'asc' }).lean()
    await db.disconnect()

    //TODO: Actualizar la imagenes

    return res.status(200).json(products)
}


const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct

    if( !isValidObjectId(_id) ){
        return res.status(400).json({ message: 'El ID del producto NO es valido' })
    }

    if( images.length < 2 ){
         return res.status(400).json({ message: 'Son necesarias al menos 2 imagenes' })
    }

    //TODO: posiblemente tendremos un localhost:300/product/asdasd.jpg
    
    try {
        await db.connect()
        const product = await Product.findById(_id)

        if(!product){
            await db.disconnect()
            return res.status(400).json({ message: 'No existe un producto con ese ID' })
        }

        // TODO: Eliminar imagenes del Clouddinary

        await product.update( req.body )

        await db.disconnect()

        return res.status(200).json( product )

    } catch (error) {
        console.log(error);
        await db.disconnect()
        return res.status(500).json({ message: 'Hubo un error inesperado, revisar la consola del servidor' })
    }

}

