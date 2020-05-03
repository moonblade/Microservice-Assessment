const mongodb = require('mongodb');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);

let db = null;
MongoClient.connect((err, client) => {
  if (err) throw err;
  db = client.db().collection('documents');
});

module.exports = {
  get: (ticket) => db.findOne({ 'status.ticket': ticket }),
  update: (ticket, document) => db.updateOne({
    'status.ticket': ticket,
  }, {
    $set: {
      status: document.status,
      watermark: document.watermark,
    },
  }),
};
