const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
    let document = req.body || {};
    type = document.topic ? 'book' : 'journal'
    let watermark = {
        title: document.title,
        type,
        author: document.author,
        topic: document.topic,
    }
    document.watermark = watermark;
    res.json(document)
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))