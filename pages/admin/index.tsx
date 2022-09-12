import React from 'react'

import { NextPage } from 'next'

import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid } from '@mui/material'

import { AdminLayout } from '../../components/layouts'
import { SumamryTile } from '../../components/admin';



const DashboarPage: NextPage = () => {
    return (
        <AdminLayout title="Dashboar" subtitle="Estadisticas generales" icon={<DashboardOutlined />}>
            <Grid container spacing={2}>
                
                <SumamryTile 
                    title={'2'} 
                    subtitle={'Ordenes totales'} 
                    icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={'3'} 
                    subtitle={'Ordenes pagadas'} 
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 45 }} />}
                />
                <SumamryTile 
                    title={'2'} 
                    subtitle={'Ordenes pendientes'} 
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={'4'} 
                    subtitle={'Clientes'} 
                    icon={<GroupOutlined color="warning" sx={{ fontSize: 40 }} />}
                />
                <SumamryTile 
                    title={'51'} 
                    subtitle={'Productos'} 
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />
            
                <SumamryTile 
                    title={'4'} 
                    subtitle={'Productos sin existencias'} 
                    icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SumamryTile 
                    title={'4'} 
                    subtitle={'Bajo inventario'} 
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SumamryTile 
                    title={'30'} 
                    subtitle={'Actualización'} 
                    icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />
            
            </Grid>
        </AdminLayout>
    )
}

export default DashboarPage