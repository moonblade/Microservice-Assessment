const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('assess-userInterface');

const app = express();
const port = 3001;
const { v4: uuid } = require('uuid');
const db = require('./db');
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
  return res.status(500).send('Not implemented');
  const { ticket } = req.query;
  if (ticket) {
    db.get().sendMessage({ ticket }).then((result) => {
      if (result) {
        if (result && result.status) res.json(result.status.string || 'unknown');
        else return Promise.reject(new Error({ status: 500, message: 'Status not found on document' }));
      } else {
        return Promise.reject(new Error({ status: 400, message: 'No document found' }));
      }
      return null;
    }).catch((error) => {
      if (error.status) res.status(error.status).json(error);
      else res.status(500).send('Some error occured');
    });
  } else {
    res.status(400).send();
  }
});

app.get('/document', (req, res) => {
  const { ticket } = req.query;
  if (ticket) {
    db.get().sendMessage({ ticket }).then((result) => {
      if (result) {
        res.json(JSON.parse(result.document || ''));
      } else {
        return Promise.reject(new Error({ status: 400, message: 'No document found' }));
      }
      return null;
    }).catch((error) => {
      if (error.status) res.status(error.status).json(error);
      else res.status(500).send(error);
    });
  } else {
    res.status(400).send();
  }
});
app.listen(port, () => debug(`Example app listening at http://localhost:${port}`));
