const db = require('./db');
const axios = require('axios');
const config = require('./config');

function runWorker(){
    // console.log("running worker")
    return db.get()
    .then(result=>{
        doc = result;
        if (doc && doc.status && doc.status.ticket) {
            // console.log("processing " + doc.status.ticket)
            return axios.post(config.base + "/watermark", {ticket: doc.status.ticket});
        }
        else
            return Promise.reject();
    }).then(result=>{
        // console.log("processed")
        runWorker();
    }).catch(error=>{
        // console.log(error)
        setTimeout(runWorker, 10000);
    });
}


runWorker()