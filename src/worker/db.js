const config = require('../common/config')
var MongoClient = require('mongodb').MongoClient(config.mongoUri)
var db = {
    findOne: ()=>{
        return Promise.reject();
    }
};
MongoClient.connect((err, client) => {
    if (err)
        throw err
    db = client.db().collection('documents')
});

module.exports = {
    get: () => {
        return db.findOne({ "status.string": "pending" })
    }
}