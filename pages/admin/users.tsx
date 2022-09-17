
import { NextPage } from 'next';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import { useState, useEffect } from 'react';



const UsersPage: NextPage = () => {
    

    const [users, setUsers] = useState<IUser[]>([])
    const { data, error } = useSWR<IUser[]>('/api/admin/users')


    useEffect(()=>{
        if(data){
            setUsers( data )
        }
    },[data])


    if( !data ){
        return <></>
    }

    if( error ){
        console.log(error);
        return <></>
    }

    const onRoleUpdated = async( userId:string, newRole:string )=>{

        const previusUsers = [ ...users ]


        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }))
        setUsers(updatedUsers)


        try {
            await tesloApi.put('/admin/users', {
                userId,
                role: newRole
            })

        } catch (error) {

            setUsers(previusUsers)
            console.log(error);
            console.log('No se pudo actualizar el Rol del usuario');
        }
        
    }


    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nambre Completo', width: 300 },
        { field: 'email', headerName: 'Correo', width: 250 },
        { 
            field: 'role', 
            headerName: 'Role', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams)=>{
                return (
                    <Select 
                        value={ row.role } 
                        label="Rol"
                        onChange={ ({ target })=>onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Client</MenuItem>
                    </Select>
                )
            } 
        },
    ]

    const rows = users.map( ( user ) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })) 

    
    
    
    return (
        <AdminLayout
            title={'Usuarios'}
            subtitle={'Matenimiento de Usuarios'}
            icon={<PeopleOutline />}
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

export default UsersPage