import { isValidObjectId } from "mongoose";
import { db } from "./";
import { IOrder } from "../interfaces";

import Order from '../models/Order';


export const getOrderById = async( id:string ):Promise<IOrder | null> => {

    if( !isValidObjectId(id) ){
        return null
    }

    try {
        
        await db.connect()
        const order =  await Order.findById( id ).lean()
        await db.disconnect()
    
        if( !order ){
            return null
        }

        return JSON.parse( JSON.stringify( order ) )

    } catch (error) {
        
        console.log(error);
        return null
    }
}



export const getOrdersByUser = async( userId:string ):Promise<IOrder[] | null> => {

    if( !isValidObjectId(userId) ){
        return null
    }

    try {
        
        await db.connect()
        const orders =  await Order.find({user: userId}).lean()
        await db.disconnect()

        return JSON.parse( JSON.stringify( orders ) )

    } catch (error) {
        
        console.log(error);
        return null
    }
}