// const mongodb = require('mongodb');
// const config = require('../common/config');

// const MongoClient = mongodb.MongoClient(config.mongoUri);

// let db = null;
// MongoClient.connect((err, client) => {
//   if (err) throw err;
//   db = client.db().collection('documents');
// });

// module.exports = {
//   get: (ticket) => db.findOne({ ticket }),
//   update: (ticket, watermark) => db.updateOne({
//     ticket,
//   }, {
//     $set: {
//       watermark: document.watermark,
//     },
//   }),
// };
const PROTO_PATH = `${__dirname}/document.proto`;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpcPromise = require('grpc-promise');
const docService = 'documentservice:3002';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const { DocumentService } = grpc.loadPackageDefinition(packageDefinition);
const client = new DocumentService(
  docService,
  grpc.credentials.createInsecure(),
);
grpcPromise.promisifyAll(client);

module.exports = client;
