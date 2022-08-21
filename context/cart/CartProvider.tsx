import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie'

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';


interface Props {
    children: JSX.Element
}

export interface CartState {
    cart: ICartProduct[]

}

const CART_INITIAL_STATE: CartState = {
    cart: [],
}


export const CartProvider: FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(()=>{
        
        try {
            const cookiesCart = Cookie.get('teslo-shop-cart') 
                ? JSON.parse( Cookie.get('teslo-shop-cart')! ) 
                : []
            
            dispatch({type: '[Cart] - Load cart from cookies | storage', payload: cookiesCart}) 
        } catch (error) {
            dispatch({type: '[Cart] - Load cart from cookies | storage', payload: []}) 
        }

    },[])

    useEffect(()=>{
        if(state.cart.length > 0){ 
            Cookie.set('teslo-shop-cart', JSON.stringify(state.cart))
        }
    },[state.cart])


    const addNewProductToCart = (newProduct: ICartProduct) => {
          
        const existProduct = state.cart.find( product => ( product._id === newProduct._id && product.size === newProduct.size ))

        if(existProduct) {
            const productTemp:ICartProduct = {
                ...existProduct,
                 quantity: existProduct.quantity + newProduct.quantity
            }

            dispatch({ type: '[Cart] - Update product in cart', payload: productTemp })

        } else {
            dispatch({ type: '[Cart] - Add product to cart', payload: newProduct })
        }

    }

    const updateCartQuantity = ( product: ICartProduct ) => {

        dispatch({ type: '[Cart] - Update product in cart', payload: product })
    }
    
    const removeCartProduct = (  product: ICartProduct ) => {
        
        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addNewProductToCart,
            updateCartQuantity,
            removeCartProduct
        }}>
            {children}
        </CartContext.Provider>
    )
}
