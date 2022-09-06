import { User } from "../models"
import { db } from "./"
import bcryptjs from 'bcryptjs';



export const checkEmailPassword = async ( email: string, password: string ) => {


    await db.connect()

    const user = await User.findOne({ email })

    await db.disconnect()

    if( !user ){ 
        return null
    }

    if( !bcryptjs.compareSync( password, user.password! ) ){
        return null
    }

    const { role, name, _id } = user

    return{
        _id,
        email: email.toLowerCase(),
        role,
        name,
    }

}

// Crea o verifica un usuario mediante OAuth
export const oAuthToDBUser = async ( oAuthEmail: string, oAuthName: string ) => {

    await db.connect()
    const user = await User.findOne({ email: oAuthEmail })

    if( user ){
        await db.disconnect()
        const { _id, name, email, role } = user
        return { _id, name, email, role }
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password:'@', role: 'client' })
    await newUser.save()
    await db.disconnect()

    const { _id, name, email, role } = newUser
    return { _id, name, email, role }

}