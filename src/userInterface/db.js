const PROTO_PATH = `${__dirname}/../common/document.proto`;
const config = require('../common/config')
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const grpc_promise = require('grpc-promise');
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const documentService = grpc.loadPackageDefinition(packageDefinition).DocumentService;
const client = new documentService(
    config.docService,
    grpc.credentials.createInsecure()
);
grpc_promise.promisifyAll(client);

module.exports = client;