import { useRef, useState } from 'react';
import NextLink from 'next/link'
import { GetServerSideProps } from 'next';


import { useForm } from "react-hook-form";
import useAuth from '../../hooks/useAuth';

import { Box, Grid, Typography, TextField, Button, Link, Chip, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts"

import { validations } from '../../utils';
import { useRouter } from 'next/router';

import { isValidToken } from '../../utils/jwt';


type FormData = {
    name: string,
    email: string,
    password: string,
    repitePassword: string
}


const RegisterPage = () => {

    const [showError, setShowError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter()

    const { registerUser } = useAuth()

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
    
    const password = useRef({})
    password.current = watch("password", "")




    const onRegisterUser = async ({ name, email, password }: FormData) => {
        
        setShowError(false)
        setLoading(true)

        const { hasError, message } = await registerUser(name, email, password)

        if( hasError ){
            setLoading(false)
            setShowError(true)
            setErrorMessage(message!)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        setLoading(false)
        setErrorMessage('')

        const destination = router.query.p?.toString() || '/'
        router.replace(destination)
    }

    return (
        <AuthLayout title={"Crear Cuenta"}>
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{ width: 350, padding: '1' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Crear Cuenta</Typography>
                            <Chip
                                label={errorMessage}
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant='filled'
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Se requiere minimo 2 caracteres para el nombre' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="correo"
                                type="email"
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
                                label="Contraseña"
                                type="password"
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Se requieren minimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Repite contraseña"
                                type="password"
                                variant='filled'
                                fullWidth
                                {...register('repitePassword', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Se requieren minimo 6 caracteres' },
                                    validate: value => value === password.current || "Las contraseñas no coinsiden"
                                })}
                                error={!!errors.repitePassword}
                                helperText={errors.repitePassword?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                {
                                    loading
                                        ?
                                        <CircularProgress
                                            thickness={3}
                                            size={26}
                                            sx={{ color: "white" }}
                                        />
                                        : "Crear Cuenta"
                                }
                            </Button>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="end" gap={1}>
                            <Typography>Ya tienes una cuenta</Typography>
                            <NextLink href={router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login'}  passHref>
                                <Link underline='always'>
                                    Inicia Sesión
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

// export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

//     try {        
//             const { tesloshop_token = '' } = req.cookies
//             const idUser = await isValidToken(tesloshop_token)
        
//             const { p = '/' } = query
        
//             if( idUser ){
//                 return {
//                     redirect: {
//                         destination: p.toString(),
//                         permanent: false
//                     }
//                 }
//             }
        
//     } catch (error) {
//         return {
//             props: {
                
//             }
//         }
//     }
//     return {
//         props: {
            
//         }
//     }
// }


export default RegisterPage