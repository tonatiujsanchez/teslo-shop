import { Grid, Typography } from "@mui/material"
import { useCart } from '../../hooks/useCart';
import { currency } from "../../utils";
import { NextPage } from 'next';

interface Props {
    orderValues?: {
        numberOfItems: number
        subtotal: number
        tax: number
        total: number
    }
}

export const OrderSummary:NextPage<Props> = ({ orderValues }) => {

    const { numberOfItems,subtotal, tax, total } = useCart()

    const sumaryValues = orderValues ? orderValues : { numberOfItems,subtotal, tax, total }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ sumaryValues.numberOfItems } { sumaryValues.numberOfItems > 1 ? 'Productos' : 'Producto' }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ currency.formatCurrency( sumaryValues.subtotal ) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Inpuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ currency.formatCurrency( sumaryValues.tax ) }</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total: </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
                <Typography variant="subtitle1">{ currency.formatCurrency( sumaryValues.total ) }</Typography>
            </Grid>
        </Grid>
    )
}
