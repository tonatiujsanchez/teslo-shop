

import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';
import { ShippingAddress } from './';


interface ContextProps {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number
    subtotal: number
    tax: number
    total: number

    shippingAddress?: ShippingAddress

    // Methods
    addNewProductToCart: (newProduct: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartProduct: (product: ICartProduct) => void
    updateAddress: (newAddress: ShippingAddress) => void
}


export const CartContext = createContext({} as ContextProps)