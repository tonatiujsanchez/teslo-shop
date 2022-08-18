import { FC, useReducer } from 'react';
import { UIContext, uiReducer } from './';


interface Props {
    children: JSX.Element
}

export interface UIState {
    isMenuOpen: boolean;

}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false,
}


export const UIProvider: FC<Props> = ({ children }) => {


    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' })
    }

    return (
        <UIContext.Provider value={{
            ...state,

            // Methods
            toggleSideMenu
        }}>
            {children}
        </UIContext.Provider>
    )
}
