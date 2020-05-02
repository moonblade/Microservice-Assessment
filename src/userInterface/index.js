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

app.get('/status', (req, res) => {
    ticket = req.query.ticket
    if (ticket) {
        db.get(ticket).then(result=>{
            if (result) {
                if (result && result.status)
                    res.json(result.status.string || unknown);
                else
                    return Promise.reject({status: 500, message:"Status not found on document"})
            } else {
                return Promise.reject({status: 401, message:"No document found"})
            }
        }).catch(error=>{
            if (error.status)
                res.status(error.status).json(error);
            else
                res.status(500).send("Some error occured")
        })
    } else {
        res.status(400).send()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))