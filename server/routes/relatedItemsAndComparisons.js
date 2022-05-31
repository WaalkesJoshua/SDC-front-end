const express = require('express');
const router = express.Router();

const sendRequest = require('../lib/sendRequest.js');

const getAverageRating = (product) => {
  let ratings = product.ratings;
  let [ totalResponses, score] = [0, 0];
  for (let star in ratings) {
    score += Number(star) * Number(ratings[star]);
    totalResponses += Number(ratings[star]);
  }
  let finalScore = Math.ceil(4 * (score / totalResponses)) / 4;
  return finalScore;
};

router.get('/ric/:product_id', async (req, res, next) => {
  // GET RELATED PRODUCT IDS
  const currentProductId = req.params.product_id;
  const relatedEndpoint = `products/${currentProductId}/related`;
  await sendRequest(relatedEndpoint)
    .then(relatedProducts => {
      return relatedProducts.data
    })
    .then(relatedProductIds => {
      return Promise.allSettled(relatedProductIds.map(async (id) => {
        let response = await sendRequest(`products/${id}`);
        return response.data;
      }));
    })
    // GET RELATED PRODUCT RATINGS
    .then(promiseArr => {
      let products = promiseArr.map(promise => { return promise.value });
      return Promise.allSettled(products.map(async (product) => {
        const ratingsEndpoint = `reviews/meta/?product_id=${product.id}`;
        let response = await sendRequest(ratingsEndpoint);
        let rating = getAverageRating(response.data);
        product.star_rating = rating;
        return product;
      }))
    })
    // GET RELATED PRODUCT STYLES
    .then(promiseArr => {
      let products = promiseArr.map(promise => { return promise.value });
      return Promise.allSettled(products.map(async (product) => {
        const relatedEndpoint = `products/${product.id}/styles`;
        let response = await sendRequest(relatedEndpoint);
        product.styles = response.data.results;
        return product;
      }))
    })
    .then(promiseArr => {
      let products = promiseArr.map(promise => { return promise.value });
      res.status(200).json(products);
    })
    .catch(err => { next(err); })
});

router.get('/ric/main/:product_id', async (req, res, next) => {
  // GET RELATED PRODUCT IDS
  const currentProductId = req.params.product_id;
  const currentProductEndpoint = `products/${currentProductId}`;
  await sendRequest(currentProductEndpoint)
    .then(currentProduct => {
      return currentProduct.data
    })
    // GET RELATED PRODUCT RATINGS
    .then(async (product) => {
      const ratingsEndpoint = `reviews/meta/?product_id=${product.id}`;
      return await sendRequest(ratingsEndpoint)
        .then(response => {
          let rating = getAverageRating(response.data);
          product.star_rating = rating;
          return product
        })
    })
    // GET RELATED PRODUCT STYLES AND SEND
    .then(async (product) => {
      const endpoint = `products/${product.id}/styles`;
      await sendRequest(endpoint)
        .then(response => {
          product.styles = response.data.results;
          res.status(200).json(product);
        })
        .catch(err => { next(err); })
    })
    .catch(err => { next(err); })
});

module.exports  = {relatedRouter: router}