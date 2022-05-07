const config = require('../../config.js');
const axios = require('axios');

const getRICProducts = (endpoint) => {
  return axios.get(`${config.HOST + endpoint}`, {
    headers: {
      'Authorization': config.TOKEN,
      'Content-Type': 'application/json'
    }
  })
};

module.exports = getRICProducts;
