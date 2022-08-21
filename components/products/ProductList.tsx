import { Grid } from "@mui/material"
import { FC } from "react"
import { IProduct } from "../../interfaces"
import { ProductCard } from "./"

interface Props {
    products: IProduct[]
}

export const ProductList:FC<Props> = ({products}) => {
  return (
    <Grid container>
      <Grid container spacing={4} sx={{marginInline: 'auto'}} >
          {
              products.map( product => (
                  <ProductCard product={product} key={product.slug}/>
              ))

          }
      </Grid>
    </Grid>
  )
}
