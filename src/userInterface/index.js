const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
const { v4: uuid } = require('uuid');
const db = require('./db');

app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
  const document = req.body || {};
  // status can be 'created', 'pending', 'completed'
  const ticket = uuid();
  document.status = {
    string: 'created',
    ticket,
  };
  db.insert().sendMessage({ document: JSON.stringify(document), ticket }).then(() => {
    res.send(document.status.ticket);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.get('/status', (req, res) => {
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
  const { ticket } = req.query.ticket;
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
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
