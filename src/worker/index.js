const axios = require('axios');
const debug = require('debug')('assess-worker');
const pubsub = require('./pubsub');
const watermarker = 'http://watermarker:3000';

debug('Worker is running');
pubsub.subscription.on('message', async (message) => {
  const { ticket, status } = message.attributes;
  if (status === 'created') {
    debug(`Sending watermark request for ticket ${ticket}`);
    axios.post(`${watermarker}/watermark`, { ticket });
    await pubsub.publish({
      ticket,
      status: 'pending',
    });
  }
  message.ack();
});
