import { Grid, Typography } from "@mui/material"


export const OrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>4</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>{`$${ 163.56 }`}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Inpuestos (15%)</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>{`${ 35.2 }`}</Typography>
        </Grid>

        <Grid item xs={6} sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Total: </Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
            <Typography variant="subtitle1">{`$${ 186.58 }`}</Typography>
        </Grid>
    </Grid>
  )
}
