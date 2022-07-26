import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Order, Product, User } from '../../models'



type Data = {
    message: string
}

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if( process.env.NODE_ENV === 'production' ){
        return res.status(401).json({ message: 'No tiene acceso a este servicio' })
    }

    await db.connect()

    // Users
    await User.deleteMany()
    await User.insertMany( seedDatabase.initialData.users )

    // Products
    await Product.deleteMany()
    await Product.insertMany( seedDatabase.initialData.products )

    // Orders
    await Order.deleteMany();


    await db.disconnect()

    return res.status(200).json({ message: 'Proceso realizado correctamente' })
}