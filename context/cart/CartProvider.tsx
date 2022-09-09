import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie'
import axios from 'axios';

import { CartContext, cartReducer } from './';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { countries } from "../../utils"
import { tesloApi } from '../../api';

interface Props {
    children: JSX.Element
}

export interface CartState {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number
    subtotal: number
    tax: number
    total: number

    shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,

    shippingAddress: undefined
}


export const CartProvider: FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(() => {

        try {
            const cookiesCart = Cookie.get('tesloshop_cart')
                ? JSON.parse(Cookie.get('tesloshop_cart')!)
                : []

            if (cookiesCart.length === 0) {
                dispatch({ type: '[Cart] - Loading' })
                return
            }


            dispatch({ type: '[Cart] - Load cart from cookies | storage', payload: cookiesCart })
            dispatch({ type: '[Cart] - Loading' })

        } catch (error) {
            dispatch({ type: '[Cart] - Loading' })
            dispatch({ type: '[Cart] - Load cart from cookies | storage', payload: [] })
        }

    }, [])


    useEffect(() => {

        if( !Cookie.get('tesloshop_firstName') ){ return }

        const shippingAddress: ShippingAddress = {
            firstName: Cookie.get('tesloshop_firstName') || '',
            lastName : Cookie.get('tesloshop_lastName')  || '',
            address  : Cookie.get('tesloshop_address')   || '',
            address2 : Cookie.get('tesloshop_address2')  || '',
            zip      : Cookie.get('tesloshop_zip')       || '',
            city     : Cookie.get('tesloshop_city')      || '',
            country  : Cookie.get('tesloshop_country')   || countries[0].code,
            phone    : Cookie.get('tesloshop_phone')     || '',
        }
        dispatch({ type: '[Cart] - Load address from Cookies', payload: shippingAddress })
    }, [])


    useEffect(() => {
        Cookie.set('tesloshop_cart', JSON.stringify(state.cart))
    }, [state.cart])



    useEffect(() => {

        const numberOfItems = state.cart.reduce((total, product) => (total + product.quantity), 0)
        const subtotal = state.cart.reduce((total, product) => (total + (product.price * product.quantity)), 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const orderSummary = {
            numberOfItems,
            subtotal,
            tax: subtotal * taxRate,
            total: subtotal * (taxRate + 1)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })


    }, [state.cart])


    const addNewProductToCart = (newProduct: ICartProduct) => {

        const existProduct = state.cart.find(product => (product._id === newProduct._id && product.size === newProduct.size))

        if (existProduct) {
            const productTemp: ICartProduct = {
                ...existProduct,
                quantity: existProduct.quantity + newProduct.quantity
            }

            dispatch({ type: '[Cart] - Update product in cart', payload: productTemp })

        } else {
            dispatch({ type: '[Cart] - Add product to cart', payload: newProduct })
        }

    }

    const updateCartQuantity = (product: ICartProduct) => {

        dispatch({ type: '[Cart] - Update product in cart', payload: product })
    }

    const removeCartProduct = (product: ICartProduct) => {

        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    }

    const updateAddress = ( newAddress: ShippingAddress ) => {


        Cookie.set('tesloshop_firstName', newAddress.firstName)
        Cookie.set('tesloshop_lastName', newAddress.lastName)
        Cookie.set('tesloshop_address', newAddress.address)
        Cookie.set('tesloshop_address2', newAddress.address2 || '')
        Cookie.set('tesloshop_zip', newAddress.zip)
        Cookie.set('tesloshop_city', newAddress.city)
        Cookie.set('tesloshop_country', newAddress.country)
        Cookie.set('tesloshop_phone', newAddress.phone)

        dispatch({ type: '[Cart] - Update address', payload: newAddress })
    }

    const createOrder = async():Promise<{ hasError:boolean; message: string }> => {


        if( !state.shippingAddress ){
            throw new Error("No hay dirección de entrega");
        }

        const body: IOrder = {
            orderItems: state.cart.map( product => ({ ...product, size: product.size! }) ),
            shippingAddress: state.shippingAddress,

            numberOfItems: state.numberOfItems,
            subtotal: state.subtotal,
            tax: state.tax,
            total: state.total,

            isPaid: false,
        }

        try {
            
            const { data } = await tesloApi.post<IOrder>('/orders', body)
            dispatch({ type: '[Cart] - Order complete' })

            return {
                hasError: false,
                message: data._id!,
            }

        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message: message
                }
            }

            return {
                hasError: true,
                message: 'Hubo un error inesperado, comuniquese con soporte',
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addNewProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            // Orders
            createOrder
        }}>
            {children}
        </CartContext.Provider>
    )
}
