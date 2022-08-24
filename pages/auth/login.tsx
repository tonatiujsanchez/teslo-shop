import { useState } from 'react';
import NextLink from 'next/link'

import { Box, Grid, Typography, TextField, Button, Link, Chip, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { useForm } from "react-hook-form";

import { AuthLayout } from "../../components/layouts"
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/router';


type FormData = {
    email: string,
    password: string,
};


const LoginPage = () => {

    const [showError, setShowError] = useState(false)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const { loginUser } = useAuth()


    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false)
        setLoading(true)

        const isValidLogin = await loginUser(email, password)

        if( !isValidLogin ){
            setLoading(false)
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        setLoading(false)

        // TODO: Navegar a la pantalla que el usurio pide
        router.replace('/')

    }

    return (
        <AuthLayout title={"Ingresar"}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '1' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Iniciar Sesión</Typography>
                            <Chip
                                label="No se reconoce el usuario o contraseña"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="correo"
                                variant='filled'
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Contraseña"
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Se requieren mínimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                                disabled={loading}
                            >
                                {
                                    loading 
                                     ?
                                     <CircularProgress
                                         thickness={ 3 } 
                                         size={26}
                                         sx={{color:"white"}}
                                     />
                                     : "Ingresar"
                                }
                                
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
            </form>
        </AuthLayout>
    )
}

export default LoginPage