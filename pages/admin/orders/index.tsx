import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layouts';
import useSWR from 'swr';
import { FullScreenLoading } from '../../../components/ui';
import { IOrder, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre', width: 250 },
    { field: 'total', headerName: 'Total $', width: 150 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ( { row }:GridValueGetterParams ) =>{
            return row.isPaid
                ? <Chip variant='outlined' label="Pagada" color='success' />
                : <Chip variant='outlined' label="Pendiente" color='error' />
        },
        width: 150
    },
    { field: 'numberOfProducts', headerName: 'No. productos', align: "center", width: 150 },
    { field: 'createdAt', headerName: 'Creada en', width: 250},
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ( { row }:GridValueGetterParams ) =>{
            return (
                <a href={`/admin/orders/${ row.id }`} target="_blank" rel="noreferrer">
                    Ver orden
                </a>
            )
        }
    },
]


const OrdersPage = () => {


    const { data, error } = useSWR<IOrder[]>(`/api/admin/orders`)

    if( !data && !error ) return ( <></> )

    if( !data ) return ( <FullScreenLoading /> ) 



    const rows = data!.map( order => {
        return (
            {
                id: order._id,
                email: (order.user as IUser).email,
                name: (order.user as IUser).name,
                total: order.total,
                isPaid: order.isPaid,
                numberOfProducts: order.numberOfItems,
                createdAt: order.createdAt,
            }
        )
    })

    return (
        <AdminLayout
            title={'Orders'}
            subtitle={'Manteniminentos de Ordenes'}
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default OrdersPage