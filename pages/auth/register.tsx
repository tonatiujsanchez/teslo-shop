import NextLink from 'next/link'
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';
import { AuthLayout } from "../../components/layouts"


const RegisterPage = () => {
    return (
        <AuthLayout title={"Crear Cuenta"}>
            <Box sx={{ width: 350, padding: '1' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">Crear Cuenta</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre completo"
                            variant='filled'
                            fullWidth
                        />
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
                            Registrarme    
                        </Button> 
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="end" gap={1}>
                        <Typography>Ya tienes una cuenta</Typography>
                        <NextLink href="/auth/login" passHref>
                            <Link underline='always'>
                                Inicia Sesión
                            </Link>
                        </NextLink> 
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    )
}

export default RegisterPage