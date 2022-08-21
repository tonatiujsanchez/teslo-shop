import { useState } from "react"

import NextLink from "next/link"

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, MenuOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { useRouter } from "next/router"
import { useUI } from "../../hooks"
import { useCart } from '../../hooks/useCart';



export const Navbar = () => {

    const router = useRouter()
    const { pathname } = router

    const { toggleSideMenu } = useUI()
    const { numberOfItems } =useCart()

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    
    const onSearchTerm = () => {
        if (searchTerm.trim().length <= 0) {
            return
        }
        router.push(`/search/${searchTerm}`)
    }


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

                <Box 
                    sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className="fadeIn"
                >
                    <NextLink href='/category/men' passHref>
                        <Link>
                            <Button color={pathname === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref>
                        <Link>
                            <Button color={pathname === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref>
                        <Link>
                            <Button color={pathname === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />
                {/* Desktop */}

                {
                    isSearchVisible
                        ? <Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className="fadeIn"
                            autoFocus={true}
                            type='text'
                            name="searchTerm"
                            value={searchTerm}
                            onChange={({ target }) => setSearchTerm(target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            placeholder="Buscar producto..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false) }
                                    >
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        : <IconButton
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            onClick={ ()=> setIsSearchVisible(true) }
                            className="fadeIn"
                            >
                            <SearchOutlined />
                        </IconButton>
                }

                {/* Movil */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 9 ? '9+' : numberOfItems } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>
                
                <Button
                    onClick={toggleSideMenu}
                >
                    <MenuOutlined />
                </Button>

            </Toolbar>
        </AppBar>
    )
}
