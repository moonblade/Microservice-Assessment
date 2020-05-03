const mongodb = require('mongodb');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);

let db = null;
MongoClient.connect((err, client) => {
  if (err) throw err;
  db = client.db().collection('documents');
});

module.exports = {
  get: (ticket) => db.findOne({ ticket }),
  update: (ticket, document) => db.updateOne({
    ticket,
  }, {
    $set: {
      watermark: document.watermark,
    },
  }),
};
