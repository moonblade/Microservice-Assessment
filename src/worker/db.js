const mongodb = require('mongodb');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);

let db = {
  findOne: () => Promise.reject(),
};
MongoClient.connect((err, client) => {
  if (err) throw err;
  db = client.db().collection('documents');
});

module.exports = {
  get: () => db.findOne({ 'status.string': 'pending' }),
};
