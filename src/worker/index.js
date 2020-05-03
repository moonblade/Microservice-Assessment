const axios = require('axios');
const db = require('./db');
const config = require('./config');

function runWorker() {
  // console.log("running worker")
  return db.get()
    .then((result) => {
      const doc = result;
      if (doc && doc.status && doc.status.ticket) {
        // console.log("processing " + doc.status.ticket)
        return axios.post(`${config.base}/watermark`, { ticket: doc.status.ticket });
      } return Promise.reject();
    }).then(() => {
      // console.log("processed")
      runWorker();
    }).catch(() => {
      // console.log(error)
      setTimeout(runWorker, 10000);
    });
}


runWorker();
