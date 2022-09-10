import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'
import { isValidObjectId } from "mongoose"

import { Order } from '../../../models'
import { db } from '../../../database'
import { IPaypal } from '../../../interfaces'
import { getSession } from 'next-auth/react'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {

        case 'POST':
            return payOrder( req, res )

    
        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }

}


const getPaypalBearerToken = async():Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials')

    try {

        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } )

        return data.access_token

    } catch (error) {

        if( axios.isAxiosError( error ) ){
            console.log( error.response?.data )
        }else{
            console.log(error)
        }
        return null
    }

}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Verificar autenticación
    const session: any = await getSession({ req })

    if( !session ){
        return res.status(401).json({ message: 'Este proceso requiere autenticación' })
    }
    
    const { transactionId = '', orderId = '' } = req.body
    
    // Verificar que el ID de la orden sea valido
    if( !isValidObjectId( orderId ) ){
        return res.status(401).json({ message: 'ID de la orden no valido' })
    }

    // Obtener token de paypal
    const paypalBearerToken = await getPaypalBearerToken()

    if(!paypalBearerToken){
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' })
    }

    // Obtener datos de la Orden de paypal
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers:{
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    })

    if( data.status !== 'COMPLETED' ){
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    await db.connect()
    const dbOrder = await Order.findById( orderId )

    if( !dbOrder ){
        await db.disconnect()
        return res.status(400).json({ message: 'Orden Inexistente' })
    }

    // Validar que el monto pagado en Paypal coincida con la DB
    if( dbOrder.total !== Number( data.purchase_units[0].amount.value ) ){
        await db.disconnect()
        return res.status(400).json({ message: 'El total a pagar NO es valido, no coincide con Paypal' })
    }

    dbOrder.transactionId = transactionId
    dbOrder.isPaid = true
    await dbOrder.save()
    
    return res.status(200).json({ message: 'Orden pagada' })

}
