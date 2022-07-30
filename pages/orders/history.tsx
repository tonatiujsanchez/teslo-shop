import NextLink from 'next/link'
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts/ShopLayout';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Indica que la orden esta pagada o no',
        width: 200,
        renderCell: (params: GridValueGetterParams )=> {
            return (
                params.row.paid
                    ? <Chip color='success' label="Pagada" variant='outlined' />
                    : <Chip color='error' label="No Pagada" variant='outlined' />
            )
        }
    },
    {
        field: 'options',
        headerName: 'Opciones',
        width: 150,
        sortable: false,
        renderCell: (params: GridValueGetterParams)=> (
            <NextLink href={`/orders/${ params.row.id }`}>
                <Link color="secondary" underline='always'>Ver orden</Link>
            </NextLink>
        )
    }
]

const rows = [
    { id: 1, paid: false, fullname: 'Tonatiuj Sanchez' },
    { id: 2, paid: true, fullname: 'Nataly Cardoso' },
    { id: 3, paid: true, fullname: 'Santiago Henandez' },
    { id: 4, paid: false, fullname: 'Brandon Sénchez' },
]


const HistoryPage = () => {
    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
                <Typography variant='h1' component="h1" sx={{ mb:2 }}>Historial de ordenes</Typography>

                <Grid container>
                    <Grid item xs={12} sx={{ height:650, width:'100%' }}>
                        <DataGrid 
                            columns={columns} 
                            rows={rows} 
                            pageSize={10}
                            rowsPerPageOptions={[10]}   
                        />
                    </Grid>
                </Grid>
        </ShopLayout>
    )
}

export default HistoryPage