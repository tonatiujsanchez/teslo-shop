import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IUser } from '../../../interfaces'
import { User } from '../../../models'
import { isValidObjectId } from 'mongoose';

type Data = 
    | { message: string }
    | IUser[]
    | IUser


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers( req, res )
        
        case 'PUT':
            return updateUser( req, res )
    
        default:
            return res.status(400).json({ message: 'Endpoint NO existe' })
    }

}


const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    await db.connect()
    const users = await User.find().select('-password').lean()
    await db.disconnect()

    return res.status(200).json(users)
}


const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { userId = '', role= '' } = req.body

    if( !isValidObjectId( userId ) ){
        return res.status(401).json({ message: 'ID no valido' })
    }

    const validRoles = ['admin', 'client']

    if( !validRoles.includes( role )){
        return res.status(401).json({ message: 'Role no valido' })
    }


    await db.connect()
    const user = await User.findById(userId).select('-password')
    
    if( !user ){
        return res.status(401).json({ message: 'Usuarion no encontrado' })
    }

    user.role = role
    await user.save()
    await db.disconnect()

    return res.status(200).json(user)
}

