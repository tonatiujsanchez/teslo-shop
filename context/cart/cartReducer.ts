

import { ICartProduct } from '../../interfaces';
import { CartState } from './';


type CartActionType =
    | { type: '[Cart] - Load cart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Add product to cart', payload: ICartProduct }
    | { type: '[Cart] - Update product in cart', payload: ICartProduct }
    | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
    | { 
        type: '[Cart] - Update order summary', 
        payload: {
            numberOfItems: number
            subtotal: number
            tax: number
            total: number
        } 
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        
        case '[Cart] - Load cart from cookies | storage':
            return {
                ...state,
                cart: [ ...action.payload ]
            }

        case '[Cart] - Add product to cart':
            return {
                ...state,
                cart: [...state.cart, action.payload]
            }

        case '[Cart] - Update product in cart':
            return {
                ...state,
                cart: state.cart.map( product => ( 
                    product._id === action.payload._id && product.size === action.payload.size 
                    ? action.payload 
                    : product 
                ))
            }
        
        case '[Cart] - Remove product in cart' :
            return {
                ...state,
                cart: state.cart.filter( product => !(product._id === action.payload._id && product.size === action.payload.size) )
            }
        case '[Cart] - Update order summary' :
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}