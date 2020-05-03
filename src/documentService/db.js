const config = require('../common/config')
var MongoClient = require('mongodb').MongoClient(config.mongoUri)
var collection = {
    findOne: ()=>{
        return Promise.reject({error:500, messaage: "Server not initialised yet"});
    }
};
MongoClient.connect((err, client)=>{
  if (err)
    throw err
  collection = client.db().collection('documents')
});

module.exports = {
  insert: (document)=>{
    return collection.insertOne(document);
  },
  get: (ticket) => {
    return collection.findOne({ "status.ticket": ticket })
},
}
