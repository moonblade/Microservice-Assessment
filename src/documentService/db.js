const config = require('../common/config')
var MongoClient = require('mongodb').MongoClient(config.mongoUri)
var db = null;
MongoClient.connect((err, client)=>{
  if (err)
    throw err
  db = client.db().collection('documents')
});

module.exports = {
  insert: (document)=>{
    return db.insertOne(document);
  },
  get: (ticket) => {
    return db.findOne({ "status.ticket": ticket })
},
}
