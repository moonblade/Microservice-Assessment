const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('assess-userInterface');
const axios = require('axios');
const { v4: uuid } = require('uuid');
const db = require('./db');
const { publish } = require('./pubsub');

const app = express();
const port = 3001;
const statusService = 'http://statusservice:3003';

app.use(bodyParser.json());

app.post('/watermark', async (req, res) => {
  const document = req.body || {};
  // status can be 'created', 'pending', 'completed'
  const ticket = uuid();
  document.ticket = ticket;
  debug('Create new document');
  db.insert().sendMessage({ document: JSON.stringify(document), ticket }).then(async () => {
    try {
        await publish({
            ticket,
            status: 'created',
        });
    } catch (error) {
        debug('Publish failed with error');
        debug(error);
    }
    debug(`Created successfull with ticket ${ticket}`);
    res.send(ticket);
  }).catch((error) => {
    debug('Creation of document failed with error');
    debug(error);
    res.status(500).send(error);
  });
});

app.get('/status', (req, res) => {
  const { ticket } = req.query;
  debug(`Find status of document ${ticket}`);
  axios.get(`${statusService}/status`, {
    params: {
      ticket,
    },
  }).then((result) => {
    const status = result.data;
    debug(`Found status of document ${ticket} as ${status}`);
    res.send(status);
  }).catch((error) => {
    debug('Status not found due to error');
    if (error.response && error.response.data)
        error = error.response.data
    debug(error)
    res.status(500).send(error);
  });
});

app.get('/document', (req, res) => {
  const { ticket } = req.query;
  if (ticket) {
    db.get().sendMessage({ ticket }).then((result) => {
      debug(`Get document ${ticket}`);
      if (result) {
        debug(`Document with ticket ${ticket} found`);
        res.json(JSON.parse(result.document || ''));
      } else {
        return Promise.reject({ status: 400, message: 'No document found' });
      }
      return null;
    }).catch((error) => {
      debug('Document not found due to error');
      debug(error);
      res.status(error.status || 500);
      res.send(error.message);
    });
  } else {
    res.status(400).send();
  }
});
app.listen(port, () => debug(`User interface listening at http://localhost:${port}`));
