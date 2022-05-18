import React, { useState } from 'react';
import ProductCards from './ProductCard.jsx';
import Carousel, { CarouselItem } from './Carousel';

var ProductsList = (props) => (
  <div>
    <Carousel>
      {props.products.map(product => {
        return(
          <CarouselItem key={product.id}>
            <ProductCards category={product.category}
              name={product.name}
              default_price={product.default_price}
              sale_price={product.sale_price}
              star_rating={product.star_rating}
              thumbnail={product.thumbnail}
              />
          </CarouselItem>
        )
      })}
    </Carousel>
  </div>
)

export default ProductsList;