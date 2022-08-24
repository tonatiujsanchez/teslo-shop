import type { NextApiRequest, NextApiResponse } from 'next'

import bcryptjs from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils';

type Data =
    | { message: string }
    | {
        token: string
        user: {
            email: string
            name: string
            role: string
        }
    }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':

            return checkJWT(req, res)

        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }
}


const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { tesloshop_token = '' } = req.cookies

    let userId = ''

    try {

        userId = await jwt.isValidToken( tesloshop_token )
        
    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorización no valido'
        })
    }
    
    await db.connect()
    const user = await User.findById(userId).lean()
    await db.disconnect()

    if (!user) {
        return res.status(400).json({ message: 'No existe ningun usuario con ese id' })
    }

    const { _id, email, name, role } = user

    return res.status(200).json({
        token: jwt.signToken( _id, email ),
        user: {
            email,
            name,
            role,
        }
    })

}