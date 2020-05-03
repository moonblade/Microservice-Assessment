const axios = require('axios');
const debug = require('debug')('assess-worker');
const config = require('./config');
const pubsub = require('./pubsub');

pubsub.subscription.on('message', (message) => {
  const { ticket, status } = message.attributes;
  if (status === 'created') {
    debug(`Sending watermark request for ticket ${ticket}`);
    axios.post(`${config.base}/watermark`, { ticket });
    debug('updating status to pending');
    pubsub.publish({
      ticket,
      status: 'pending',
    });
  }
  message.ack();
});
