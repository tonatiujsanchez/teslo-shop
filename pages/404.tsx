import { Box, Typography } from "@mui/material"
import { ShopLayout } from "../components/layouts"


const PageNotFound = () => {
    return (
        <ShopLayout title={"Page Not Found"} pageDescription={"No hay nada que mostrar aquí"}>
            <Box display="flex" sx={{ flexDirection: { xs: 'column', sm: 'row' } }} justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
                <Typography variant="h1" component="h1" fontSize={80} fontWeight={200}>404 | </Typography>
                <Typography marginLeft={2} fontSize={20}>Página no encontrada</Typography>
            </Box>
        </ShopLayout>
    )
}

export default PageNotFound