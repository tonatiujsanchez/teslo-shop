

import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Product, Order } from '../../../models';


type Data = 
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'POST':
            return createOrder( req, res )
    
        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }
    
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder

    // Verificar la sesion del usuario
    const session: any = await getSession({ req })
    if( !session ){
        return res.status(401).json({ message: 'Este proceso requiere autenticación' })
    }

    // obtener ids de productos
    const productsIds = orderItems.map( product => product._id )

    await db.connect()

    // Consultar productos del array de ids
    const dbProducts = await Product.find({ _id: { $in: productsIds } })
    
    try {

        const subTotal = orderItems.reduce((total, product) => {
            
            const currenPrice = dbProducts.find( p => p.id === product._id )?.price

            if( !currenPrice ){
                throw new Error('Verifique el carrito de nuevo, el producto no exite')
            }

            return total + ( currenPrice * product.quantity )
        
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const totalBackend = subTotal * (taxRate + 1)

        if( total !== totalBackend ){
            throw new Error('El total no cuadra con el monto')

        }
        
        // Todo bien hasta este punto: Creamos la orden
        const userId = session.user._id
        const newOrder = new Order({
                ...req.body, 
                isPaid: false, 
                user: userId 
            })
        await newOrder.save()


        await db.disconnect()
        return res.status(201).json( newOrder )
        
        
    } catch (error: any) {
        
        await db.disconnect()
        console.log(error)
        res.status(400).json({ message: error.message || 'Revise los logs del servidor' })
        
    }
    



    return res.status(201).json(req.body)
}
