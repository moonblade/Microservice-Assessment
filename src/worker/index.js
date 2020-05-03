const axios = require('axios');
const debug = require('debug')('assess-worker');
const config = require('./config');
const subscription = require('./pubsub');

subscription.on('message', (message) => {
  const { ticket, status } = message.attributes;
  if (status === 'created') {
    debug(`Got status update for new ticket ${ticket}`);
    debug(`Sending watermark request for ticket ${ticket}`);
    axios.post(`${config.base}/watermark`, { ticket });
  }
});
