

import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';


interface ContextProps {
    cart: ICartProduct[]
    numberOfItems: number
    subtotal: number
    tax: number
    total: number

    // Methods
    addNewProductToCart: (newProduct: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartProduct: (product: ICartProduct) => void
}


export const CartContext = createContext({} as ContextProps)