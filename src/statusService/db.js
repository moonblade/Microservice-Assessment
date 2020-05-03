const mongodb = require('mongodb');
const debug = require('debug')('assess-statusService-db');
const config = require('../common/config');

const MongoClient = mongodb.MongoClient(config.mongoUri);
let collection = {
  findOne: () => Promise.reject(new Error({ error: 500, messaage: 'Server not initialised yet' })),
};
MongoClient.connect((err, client) => {
  if (err) { throw err; }
  collection = client.db().collection('status');
  debug('Initialised collection');
});

module.exports = {
  update: (ticket, status) => collection.updateOne(
    {
      ticket,
    },
    {
      $set: {
        status,
      },
    },
    {
      upsert: true,
    },
  ),
  get: (ticket) => collection.findOne({ ticket }),
};
