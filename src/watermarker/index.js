const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('assess-watermarker');
const db = require('./db');

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
  const ticket = req.body.ticket || '';
  debug(`Watermark request for ticket ${ticket}`);
  db.get(ticket).then((rawDocument) => {
    debug('Got document to watermark');
    const document = rawDocument || {};
    const type = document.topic ? 'book' : 'journal';
    const watermark = {
      title: document.title,
      type,
      author: document.author,
      topic: document.topic,
    };
    document.watermark = watermark;
    debug('Inserted watermark');
    debug(watermark);
    return db.update(ticket, document);
  }).then(() => {
    res.send();
  }).catch((error) => {
    debug('Watermark failed with error');
    debug(error);
    res.status(500).send(error);
  });
});

app.listen(port, () => debug(`Example app listening at http://localhost:${port}`));
