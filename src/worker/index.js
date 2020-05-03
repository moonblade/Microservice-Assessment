const axios = require('axios');
const config = require('./config');
const subscription = require('./pubsub');

subscription.on('message', (message) => {
  const { ticket } = message.attributes;
  return axios.post(`${config.base}/watermark`, { ticket });
});
