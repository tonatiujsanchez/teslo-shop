import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie'

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';


interface Props {
    children: JSX.Element
}

export interface CartState {
    cart: ICartProduct[]
    numberOfItems: number
    subtotal: number
    tax: number
    total: number
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
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

    useEffect(()=>{
        if(state.cart.length > 0){ 
            const numberOfItems = state.cart.reduce( ( total, product )=>( total + product.quantity ),0)
            const subtotal = state.cart.reduce( ( total, product )=>( total + ( product.price * product.quantity ) ), 0 )
            const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 )
            
            const orderSummary = {
                numberOfItems,
                subtotal,
                tax: subtotal * taxRate,
                total: subtotal * ( taxRate + 1 )
            }
            dispatch({ type:'[Cart] - Update order summary', payload: orderSummary })
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
