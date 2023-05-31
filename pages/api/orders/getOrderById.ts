import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import * as jose from 'jose'

import { Order } from '../../../models'
import { db } from '../../../database'

import { IOrder } from '../../../interfaces'

type Data = 
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        
        case "GET":
            return getOrderById( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const getOrderById = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { idOrder = '' } = req.query 

    if( !isValidObjectId( idOrder ) ){
        return res.status(400).json({ message: 'Orden no encontrada' })
    }

    try {

        await db.connect()
        const order = await Order.findById( idOrder )
        await db.disconnect()

        if( !order ){
            return res.status(400).json({ message: 'Orden no encontrada'})
        }

        const isValidUser = await verifyUser( req, String( order?.user ) )
        
        if( !isValidUser ){
            return res.status(400).json({ message: "No autorizado" })
        }

        return res.status(200).json(order)

        
    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

    


}


const verifyUser = async( req: NextApiRequest, idOrderUser:string ):Promise<boolean> => {

    // 2.- verificar que el idUsuario de la sesion coincida con el usuario de la orden
    const { 'tesloshop_token':token } = req.cookies
    const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))

    if( payload.role === "admin" ){
        return true
    }

    if(payload._id === JSON.parse( JSON.stringify( idOrderUser ) )){
        return true
    }

    return false
}

