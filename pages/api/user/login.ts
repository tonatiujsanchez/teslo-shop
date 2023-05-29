


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
        case 'POST':

            return loginUser(req, res)

        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body

    if ([email, password].includes('')) {
        return res.status(400).json({ message: 'El email y el password son requeridos' })
    }

    await db.connect()
    const user = await User.findOne({ email })
    await db.disconnect()

    if (!user) {
        return res.status(400).json({ message: 'Correo o Contaseña no válidos (EMAIL)' })
    }

    if (!(bcryptjs.compareSync(password, user.password!))) {
        return res.status(400).json({ message: 'Correo o Contaseña no válidos (PWD)' })
    }

    const { _id, name, role } = user

    const token = jwt.signToken( _id, email, role ) //jwt

    return res.status(200).json({
        token,
        user: {
            email,
            name,
            role,
        }
    })
}
