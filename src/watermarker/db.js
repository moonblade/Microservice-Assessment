const config = require('../common/config')
var MongoClient = require('mongodb').MongoClient(config.mongoUri)
var db = null;
MongoClient.connect((err, client) => {
    if (err)
        throw err
    db = client.db().collection('documents')
});

module.exports = {
    get: (ticket) => {
        return db.findOne({ "status.ticket": ticket })
    },
    update: (ticket, document) => {
        return db.updateOne({
            "status.ticket": ticket
        }, {
            $set: {
                "status": document.status,
                "watermark": document.watermark
            }
        });
    }
}
