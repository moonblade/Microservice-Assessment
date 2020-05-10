/* eslint-disable no-underscore-dangle */
const mongodb = require('mongodb');
const debug = require('debug')('assess-documentService-db');
const mongoUri = `mongodb://user:password1@ds263108.mlab.com:63108/assessment-168`;

const MongoClient = mongodb.MongoClient(mongoUri);
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
  update: (ticket, document) => {
    // eslint-disable-next-line no-param-reassign
    delete document._id;
    return collection.replaceOne({ ticket }, document);
  },
};
