import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Product, User } from '../../../models'

type Data = 
    | { message: string }
    | { 
        numberOfOrders  : number
        paidOrders      : number
        notPaidOrders   : number
        numberOfClients : number
        nomberOfProducts: number
        productsWithNoInventory: number
        lowInventory    : number
     }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            
            return getData(req, res)
    
        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
            
    }


}

const getData = async(req: NextApiRequest, res: NextApiResponse<Data>) => {


    const numberOfOrders = await Order.find().count()
    const paidOrders = await Order.find({ isPaid: true }).count()
    const notPaidOrders = await Order.find({ isPaid: false }).count()
    const numberOfClients = await User.find({ role: 'client' }).count()
    const nomberOfProducts = await Product.find().count()
    const productsWithNoInventory = await Product.find({inStock: 0}).count()
    const lowInventory = await Product.find({inStock: {$lt: 10}}).count()
    
    

    return res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        nomberOfProducts,
        productsWithNoInventory,
        lowInventory,
    })

}
