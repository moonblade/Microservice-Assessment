const PROTO_PATH = `${__dirname}/../common/document.proto`;
var grpc = require("grpc");
const db = require('./db');
const config = require('../common/config')
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
var documentProto = grpc.loadPackageDefinition(packageDefinition);

const documentService = new grpc.Server();
documentService.addService(documentProto.DocumentService.service, {
    get: (call, callback) => {
        let ticket = call.request.ticket;
        console.log("in get " + ticket);
        db.get(ticket).then(result => {
            if (!result)
                return Promise.reject({ status: 400, message: "cannot find document with ticket" })
            console.log(result);
            callback(null, { document: JSON.stringify(result) , ticket});
        }).catch(error => {
            callback(error);
        });
    },
    insert: (call, callback) => {
        let document = JSON.parse(call.request.document);
        let ticket = call.request.ticket;
        console.log("in put " + ticket);
        db.insert(document).then(result => {
            if (!result)
                return Promise.reject({ status: 500, message: "Could not insert document" })
            callback(null, {});
        }).catch(error => {
            callback(error);
        });
    },

});

documentService.bind(config.docService, grpc.ServerCredentials.createInsecure());
console.log("document service running at " + config.docService);
documentService.start();