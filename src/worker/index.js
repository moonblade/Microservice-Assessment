const axios = require('axios');
const debug = require('debug')('assess-worker');
const config = require('./config');
const pubsub = require('./pubsub');

debug('Worker is running');
pubsub.subscription.on('message', async (message) => {
  const { ticket, status } = message.attributes;
  if (status === 'created') {
    debug(`Sending watermark request for ticket ${ticket}`);
    axios.post(`${config.base}/watermark`, { ticket });
    await pubsub.publish({
      ticket,
      status: 'pending',
    });
  }
  message.ack();
});
