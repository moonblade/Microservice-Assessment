const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('assess-userInterface');
const axios = require('axios');
const { v4: uuid } = require('uuid');

const app = express();
const port = 3001;
const db = require('./db');
const config = require('../common/config');
const { publish } = require('./pubsub');

app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
  const document = req.body || {};
  // status can be 'created', 'pending', 'completed'
  const ticket = uuid();
  document.ticket = ticket;
  debug('Create new document');
  publish({
    ticket,
    status: 'created',
  });
  db.insert().sendMessage({ document: JSON.stringify(document), ticket }).then(() => {
    debug(`Created successfull with ticket ${ticket}`);
    res.send(ticket);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.get('/status', (req, res) => {
  const { ticket } = req.query;
  debug(`Find status of document ${ticket}`);
  axios.get(`${config.statusService}/status`, {
    params: {
      ticket,
    },
  }).then((result) => {
    const status = result.data;
    debug(`Found status of document ${ticket} as ${status}`);
    res.send(status);
  }).catch((error) => {
    debug('Status not found due to error');
    debug(error.response.data);
    res.status(500).send(error.response.data);
  });
});

app.get('/document', (req, res) => {
  const { ticket } = req.query;
  if (ticket) {
    db.get().sendMessage({ ticket }).then((result) => {
      if (result) {
        res.json(JSON.parse(result.document || ''));
      } else {
        return Promise.reject({ status: 400, message: 'No document found' });
      }
      return null;
    }).catch((error) => {
      if (error.status) res.status(error.status).json(error);
      else res.status(500).send(error.message);
    });
  } else {
    res.status(400).send();
  }
});
app.listen(port, () => debug(`User interface listening at http://localhost:${port}`));
