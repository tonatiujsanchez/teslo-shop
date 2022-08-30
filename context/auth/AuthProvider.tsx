import { FC, useReducer, useEffect } from 'react';

import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './';
import { tesloApi } from '../../api';

import { IUser } from '../../interfaces';
import axios from 'axios';
import { useRouter } from 'next/router';


interface Props {
    children: JSX.Element
}

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}


export const AuthProvider: FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    const router = useRouter()


    useEffect(()=>{
        checkToken()
    },[])

    const checkToken = async() => {

            if( !Cookies.get('tesloshop_token') ){ return }
        
            try {

                const { data } = await tesloApi.get('/user/validate-token')
                const { token, user } = data
                
                Cookies.set('tesloshop_token', token)
                dispatch({ type: '[Auth] - Login', payload: user })
                
            } catch (error) {

                Cookies.remove('tesloshop_token')
            }
            
    }

    const loginUser = async( email: string, password:string ):Promise<boolean> => {

        try {
            
            const { data } = await tesloApi.post('/user/login', { email, password })
            const { token, user } = data

            Cookies.set('tesloshop_token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
            
            return true

        } catch (error) {
            return false
        }
    }

    const registerUser = async( name:string, email:string, password:string ):Promise<{ hasError: boolean, message?: string }> => {

        try {

            const { data } = await tesloApi.post('/user/register', { name, email, password })
            const { token, user } = data

            Cookies.set('tesloshop_token', token)
            dispatch({ type: '[Auth] - Login', payload: user })

            return {
                hasError: false,
                message : undefined
            }
            
        } catch (error) {

            if( axios.isAxiosError( error ) ){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message
                }
            }
            
            return {
                hasError: true,
                message: 'No se pudo crear el usuario, intente de nuevo'
            }
        }

    }

    const logout = () => {
        Cookies.remove('tesloshop_token')
        Cookies.remove('tesloshop_cart')
        router.reload()
    }


    return (
        <AuthContext.Provider value={{
            ...state,
            // Methods
            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
