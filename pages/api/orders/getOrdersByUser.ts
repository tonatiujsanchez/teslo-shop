import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import * as jose from 'jose'

import { db } from '../../../database'
import { Order } from '../../../models'

import { IOrder } from '../../../interfaces'


type Data = 
    | { message: string }
    | IOrder[]


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        
        case "GET":
            return getOrdersByUser( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


const getOrdersByUser = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    try {
        
        const { 'tesloshop_token':token } = req.cookies
        const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))

        if( !isValidObjectId( payload._id ) ){
            return res.status(400).json({ message: 'No autorizado' })
        }

        await db.connect()
        const orders =  await Order.find({user: payload._id}).lean()
        await db.disconnect()


        return res.status(200).json( orders )

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }
    
}
