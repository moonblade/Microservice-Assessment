const express = require('express')
const bodyParser = require('body-parser');
const db = require('./db');
const app = express()
const port = 3000
app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
    let ticket = req.body.ticket || {};
    db.get(ticket).then(document=>{
        document = document || {};
        type = document.topic ? 'book' : 'journal'
        let watermark = {
            title: document.title,
            type,
            author: document.author,
            topic: document.topic,
        }
        document.watermark = watermark;
        if (document.status)
            document.status.string = "completed";
        return db.update(ticket, document);
    }).then(result=>{
        res.send()
    }).catch(error=>{
        console.log(error)
        res.status(500).send(error);
    });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))