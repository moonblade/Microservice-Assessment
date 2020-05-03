const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
  const ticket = req.body.ticket || {};
  db.get(ticket).then((rawDocument) => {
    const document = rawDocument || {};
    const type = document.topic ? 'book' : 'journal';
    const watermark = {
      title: document.title,
      type,
      author: document.author,
      topic: document.topic,
    };
    document.watermark = watermark;
    if (document.status) document.status.string = 'completed';
    return db.update(ticket, document);
  }).then(() => {
    res.send();
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
