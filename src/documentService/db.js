const mongodb = require('mongodb');
const debug = require('debug')('assess-documentService-db');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);
let collection = {
  findOne: () => Promise.reject({ error: 500, message: 'Server not initialised yet' }),
};
MongoClient.connect((err, client) => {
  if (err) { throw err; }
  collection = client.db().collection('documents');
  debug('Initialised collection');
});

module.exports = {
  insert: (document) => collection.insertOne(document),
  get: (ticket) => collection.findOne({ ticket }),
};
