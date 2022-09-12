import { useState, useEffect } from 'react';

import { NextPage } from 'next'

import useSWR from 'swr'

import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'

import { AdminLayout } from '../../components/layouts'
import { SumamryTile } from '../../components/admin';
import { DashboardSummaryResponse } from '../../interfaces'



const DashboarPage: NextPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
        refreshInterval: 30 * 1000 //30 segundos
    })

    const [refreshIn, setRefreshIn] = useState(30)

    useEffect(() => {

      const interval = setInterval(()=>{        
        setRefreshIn((refreshIn)=> refreshIn > 0 ? refreshIn - 1 : 30 )
      },1000)
    
      return () => clearInterval(interval)

    }, [])
    
    
    
    if(!error && !data){
        return <></>
    }

    if( error || !data ){
        console.log(error);
        return <Typography>Hubo un error a intentar cargar las información</Typography>
    }


    const { 
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        nomberOfProducts,
        productsWithNoInventory,
        lowInventory,
     } = data


    return (
        <AdminLayout title="Dashboar" subtitle="Estadisticas generales" icon={<DashboardOutlined />}>
            <Grid container spacing={2}>
                
                <SumamryTile 
                    title={numberOfOrders} 
                    subtitle={'Ordenes totales'} 
                    icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={paidOrders} 
                    subtitle={'Ordenes pagadas'} 
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 45 }} />}
                />
                <SumamryTile 
                    title={notPaidOrders} 
                    subtitle={'Ordenes pendientes'} 
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={numberOfClients} 
                    subtitle={'Clientes'} 
                    icon={<GroupOutlined color="warning" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={nomberOfProducts} 
                    subtitle={'Productos'} 
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />
            
                <SumamryTile 
                    title={productsWithNoInventory} 
                    subtitle={'Productos sin existencias'} 
                    icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SumamryTile 
                    title={lowInventory} 
                    subtitle={'Bajo inventario'} 
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SumamryTile 
                    title={refreshIn} 
                    subtitle={'Actualización'} 
                    icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />
            
            </Grid>
        </AdminLayout>
    )
}

export default DashboarPage