import { Grid, Typography } from "@mui/material"
import { useCart } from '../../hooks/useCart';
import { currency } from "../../utils";


export const OrderSummary = () => {

    const { numberOfItems, subtotal, tax, total } = useCart()


    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ numberOfItems } { numberOfItems > 1 ? 'Productos' : 'Producto' }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ currency.formatCurrency( subtotal ) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Inpuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{ currency.formatCurrency( tax ) }</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total: </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
                <Typography variant="subtitle1">{ currency.formatCurrency( total ) }</Typography>
            </Grid>
        </Grid>
    )
}
