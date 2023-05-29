import type { NextApiRequest, NextApiResponse } from 'next'

import bcryptjs from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../models'
import { jwt, validations } from '../../../utils';

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
            return registerUser( req, res )
    
        default:
            return res.status(400).json({ message: 'Enpoint no existe' })
    }

}

const registerUser = async( req:NextApiRequest, res:NextApiResponse<Data>  ) => {
    
    const { name = '', email = '', password = '' } = req.body

    if([ name, email, password ].includes('')){
        return res.status(400).json({ message: 'Las propiedades name, email, password son requeridas' })
    }

    if( password.length < 6 ){
        return res.status(400).json({ message: 'La contraseña es muy corta, debe tener minimo 6 carateres' })
    }

    if( name.length < 2 ){
        return res.status(400).json({ message: 'El nombre es muy corto, debe tener minimo 2 carateres' })
    }

    if( !validations.isValidEmail(email) ){
        return res.status(400).json({ message: 'El correo no es válido' })
    }

    await db.connect()
    const user = await User.findOne({ email })
    
    if( user ){
        await db.disconnect()
        return res.status(400).json({ message: `Ya existe una cuenta registrada con ese correo` })
    }
    
    const newUser = new User({
        name, 
        email: email.toLowerCase(),
        password: bcryptjs.hashSync( password ),
        role: 'client'
    })

    try {
        
        await newUser.save({ validateBeforeSave: true })
        await db.disconnect()
    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Al salio mal, revisar logs del servidor' })        
    }
    
    const { _id, role } = newUser   

    const token = jwt.signToken( _id, email, role )  //jwt

    return res.status(200).json({
        token,
        user: {
            name,
            email,
            role
        }
    })
}