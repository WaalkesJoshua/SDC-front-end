const axios = require('axios');
const {token} = require('../../config');

// the Root API address: https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/

// Url String
// data - json parsable object
const sendRequest = (endpoint, method = 'GET', data = {}) => {
  // default behavior is a get request
  return axios({
    url:`http://localhost:4000/${endpoint}`,
    method: method,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    data: data
  })

}

module.exports = sendRequest;