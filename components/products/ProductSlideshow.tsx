import { FC } from "react"
import { Slide } from "react-slideshow-image"
import 'react-slideshow-image/dist/styles.css'

interface Props {
    images: string[]
}

export const ProductSlideshow:FC<Props> = ({ images }) => {
  return (
    <Slide
        easing="ease"
        duration={7000}
        indicators 
    >
        {
            images.map( image => {
                return (
                    <div className="each-slide" key={ image }>
                        <div style={{
                            backgroundImage: `url(${ image })`,
                            backgroundSize: 'cover'
                        }}>

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}
