import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { GetServerSideProps } from 'next'
import { countries } from "../../utils"

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useCart } from '../../hooks/useCart';
import { useState, useEffect } from 'react';



type FormData = {
    firstName: string
    lastName : string
    address  : string
    address2?: string
    zip      : string
    city     : string
    country  : string
    phone    : string
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('tesloshop_firstName') || '',
        lastName : Cookies.get('tesloshop_lastName')  || '',
        address  : Cookies.get('tesloshop_address')   || '',
        address2 : Cookies.get('tesloshop_address2')  || '',
        zip      : Cookies.get('tesloshop_zip')       || '',
        city     : Cookies.get('tesloshop_city')      || '',
        country  : Cookies.get('tesloshop_country')   || countries[0].code,
        phone    : Cookies.get('tesloshop_phone')     || '',
    }
}


const AddressPage = () => {

    const router = useRouter()
    const { updateAddress } = useCart() 
    const [country, setCountry] = useState<string>(countries[0].code)


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    })

    useEffect(()=>{
        if( Cookies.get('tesloshop_country') ){
            setCountry( Cookies.get('tesloshop_country') || countries[0].code )
        }
    },[])
    


    const onSubmitAddress = (data: FormData) => {
        
        updateAddress( data )

        router.push('/checkout/summary')

    }

    
    
    // if( !getAddressFromCookies() ){
    //     return <></>
    // }

    return (
        <ShopLayout title={"Direcciones"} pageDescription={"Confirmar dirección del destino"}>
            <Typography variant="h1" component="h1" sx={{ mb: 2 }}>Dirección</Typography>
            <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección 2 (Opcional)"
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                            error={!!errors.address2}
                            helperText={errors.address2?.message}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Código Postal"
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <TextField
                                key={ country }
                                select
                                variant="filled"
                                label="País"
                                defaultValue={ country }
                                {...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>

        </ShopLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {


//     const { tesloshop_token = '' } = req.cookies

//     let isValidToken = false

//     try {

//         await jwt.isValidToken(tesloshop_token)
//         isValidToken = true

//     } catch (error) {
//         console.log(error)
//         isValidToken = false    
//     }

//     if( !isValidToken ){
//         return {
//             redirect: {
//                 destination: `/auth/login?p=/checkout/address`,
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }


export default AddressPage