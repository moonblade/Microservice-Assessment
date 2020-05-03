const mongodb = require('mongodb');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);
let collection = {
  findOne: () => Promise.reject(new Error({ error: 500, messaage: 'Server not initialised yet' })),
};
MongoClient.connect((err, client) => {
  if (err) { throw err; }
  collection = client.db().collection('documents');
});

module.exports = {
  insert: (document) => collection.insertOne(document),
  get: (ticket) => collection.findOne({ ticket }),
};
