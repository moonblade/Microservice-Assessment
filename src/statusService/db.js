const mongodb = require('mongodb');
const debug = require('debug')('assess-statusService-db');
const mongoUri = `mongodb://user:password1@ds263108.mlab.com:63108/assessment-168`;

const MongoClient = mongodb.MongoClient(mongoUri);
let collection = {
  findOne: () => Promise.reject({ error: 500, messaage: 'Server not initialised yet' }),
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
