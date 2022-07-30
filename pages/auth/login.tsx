import NextLink from 'next/link'

import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';
import { AuthLayout } from "../../components/layouts"


const LoginPage = () => {
    return (
        <AuthLayout title={"Ingresar"}>
            <Box sx={{ width: 350, padding: '1' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">Iniciar Sesión</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="correo"
                            variant='filled'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            variant='filled'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="secondary" className='circular-btn' size='large' fullWidth>
                            Ingresar    
                        </Button> 
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="end" gap={1}>
                        <Typography>¿No tienes una cuenta?</Typography>
                        <NextLink href="/auth/register" passHref>
                            <Link underline='always'>
                                Registrate
                            </Link>
                        </NextLink> 
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    )
}

export default LoginPage