const debug = require('debug')('assess-statusService');
const pubsub = require('./pubsub');
const db = require('./db');

pubsub.subscription.on('message', (message) => {
  const { ticket, status } = message.attributes;
  debug(`Updating status of ${ticket} to ${status}`);
  db.update(ticket, status).catch((error) => {
    debug('Updating status failed');
    debug(error);
  });
  message.ack();
});
