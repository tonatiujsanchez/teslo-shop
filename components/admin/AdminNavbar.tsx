import NextLink from "next/link"

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"
import { MenuOutlined, } from "@mui/icons-material"

import { useUI } from "../../hooks"



export const AdminNavbar = () => {

    const { toggleSideMenu } = useUI()

    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display="flex" alignItems="center">
                        <Typography variant="h6">Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />
                
                <Button
                    onClick={toggleSideMenu}
                >
                    <MenuOutlined />
                </Button>

            </Toolbar>
        </AppBar>
    )
}
