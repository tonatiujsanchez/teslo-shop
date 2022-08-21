import { useContext } from 'react';
import { CartContext } from '../context/cart';

export const useCart = () => {
    return useContext( CartContext )
}
