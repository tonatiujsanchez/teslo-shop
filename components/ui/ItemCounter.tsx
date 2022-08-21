import { FC } from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"

interface Props {
    currentValue: number
    maxValue: number
    
    // Methods 
    onUpdatedQuantiry: ( selectedQuantiry:number ) => void
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdatedQuantiry }) => {


    const onAddOrremove = ( value: number ) => {

        if( currentValue <= 1 && value === -1  ){
            return
        }

        if( currentValue >= maxValue && value === 1 ){
            return
        }

        onUpdatedQuantiry( currentValue + value )
    }

    return (
        <Box display="flex" alignItems="center">
            <IconButton
                disabled={ currentValue <= 1 }
                onClick={ () => onAddOrremove( -1 ) }
            >
                <RemoveCircleOutline />
            </IconButton>

            <Typography sx={{ width: 40, textAlign: 'center' }}> { currentValue } </Typography>

            <IconButton
                disabled={ currentValue >= maxValue }
                onClick={ ()=> onAddOrremove( +1 ) }
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
