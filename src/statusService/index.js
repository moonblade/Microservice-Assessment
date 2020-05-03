const express = require('express');
const debug = require('debug')('assess-statusService');
const pubsub = require('./pubsub');
const db = require('./db');

const port = 3003;
const app = express();

pubsub.subscription.on('message', (message) => {
  const { ticket, status } = message.attributes;
  debug(`Updating status of ${ticket} to ${status}`);
  db.update(ticket, status).catch((error) => {
    debug('Updating status failed');
    debug(error);
  });
  message.ack();
});

app.get('/status', (req, res) => {
  const { ticket } = req.query;
  debug(`Got request for status of ${ticket}`);
  db.get(ticket).then((result) => {
    if (!result) return Promise.reject({ status: 400, message: 'Invalid ticket provided' });
    debug(`Got status as ${result.status}`);
    return res.send(result.status || 'unkown');
  }).catch((error) => {
    res.status(error.status || 400);
    debug('Get status failed with error');
    debug(error);
    res.send(error);
  });
});
app.listen(port, () => debug(`Status service listening at http://localhost:${port}`));
