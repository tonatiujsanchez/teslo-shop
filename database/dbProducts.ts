import { db } from '.'
import { Product } from '../models'

import { IProduct } from '../interfaces'

export const getProductBySlug = async( slug:string ): Promise<IProduct | null> => {

    await db.connect()
    const product = await Product.findOne({ slug }).lean()
    await db.disconnect()

    if( !product ){
        return null
    }

    // TODO: Procesamiento de imagenes, cuando se subar al serve

  return JSON.parse( JSON.stringify( product ) )
}


interface ProductSlug {
    slug: string
}

export const getAllProductSlugs = async():Promise<ProductSlug[]> => {

    db.connect()
    const slugs = await Product.find().select('slug -_id').lean()
    db.disconnect()

    return slugs
}


export const getProductsByTerm = async( term: string ): Promise<IProduct[]> => {
    
    term = term.toString().toLowerCase()

    db.connect()
    
    const products = await Product.find({
        $text: { $search: term }
    })
    .select('title images price inStock slug -_id ')
    .lean()
    
    db.disconnect()

    return products || []
}


export const gelAllProducts = async():Promise<IProduct[]> => {

    db.connect()
    const products = await Product.find().limit(12).lean()
    db.disconnect()

  return JSON.parse( JSON.stringify( products ) )
}