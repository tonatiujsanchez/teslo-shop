import { isValidObjectId } from "mongoose";
import { db } from "./";
import { IOrder } from "../interfaces";

import Order from '../models/Order';


export const getOrderById = async( id:string ):Promise<IOrder | null> => {

    if( !isValidObjectId(id) ){
        return null
    }

    db.connect()
    const order =  await Order.findById( id ).lean()
    db.disconnect()

    if( !order ){
        return null
    }


    return JSON.parse( JSON.stringify( order ) )
}

export const getOrdersByUser = async( userId:string ):Promise<IOrder[] | null> => {

    if( !isValidObjectId(userId) ){
        return null
    }

    db.connect()
    const orders =  await Order.find({user: userId}).lean()
    db.disconnect()


    return JSON.parse( JSON.stringify( orders ) )

}