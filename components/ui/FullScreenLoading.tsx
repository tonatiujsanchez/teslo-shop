import { CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system"


export const FullScreenLoading = () => {
    return (
        <Box 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center" 
            height="calc(100vh - 200px)"
            gap={2}
        >
            <CircularProgress thickness={ 2 } />
            <Typography>Cargando...</Typography>
        </Box>
    )
}
