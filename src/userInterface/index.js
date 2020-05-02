const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const { v4: uuid } = require('uuid');
const db = require('./db');
app.use(bodyParser.json());

app.post('/watermark', (req, res) => {
    let document = req.body || {};
    // status can be pending', 'completed'
    document.status = {
        ticket: uuid(),
        string: 'pending'
    }
    db.save(document).then(()=>{
        res.send(document.status.ticket);
    }).catch(error=>{
        res.status(500).send(error);
    })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))