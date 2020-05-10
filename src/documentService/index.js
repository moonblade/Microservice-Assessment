const PROTO_PATH = `${__dirname}/./document.proto`;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const debug = require('debug')('assess-documentService');
const db = require('./db');
const docService = 'documentservice:3002';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const documentProto = grpc.loadPackageDefinition(packageDefinition);

const documentService = new grpc.Server();
documentService.addService(documentProto.DocumentService.service, {
  get: (call, callback) => {
    const { ticket } = call.request;
    debug(`Get document with ticket ${ticket}`);
    db.get(ticket).then((result) => {
      if (!result) return Promise.reject({ status: 400, message: 'cannot find document with ticket' });
      debug(`retrieved document for ticket ${ticket}`);
      callback(null, { document: JSON.stringify(result), ticket });
      return null;
    }).catch((error) => {
      debug('Retrive failed with error');
      debug(error);
      callback(error);
    });
  },
  insert: (call, callback) => {
    const document = JSON.parse(call.request.document);
    debug(`Insert new document ${document.ticket}`);
    db.insert(document).then((result) => {
      if (!result) return Promise.reject({ status: 500, message: 'Could not insert document' });
      debug(`Inserted new document ${document.ticket}`);
      callback(null, {});
      return null;
    }).catch((error) => {
      debug('Insert failed with error');
      debug(error);
      callback(error);
    });
  },
  update: (call, callback) => {
    const document = JSON.parse(call.request.document);
    const { ticket } = call.request;
    debug(`Update document ${ticket}`);
    db.update(ticket, document).then((result) => {
      if (!result) return Promise.reject({ status: 500, message: 'Could not insert document' });
      debug('Updated document');
      callback(null, {});
      return null;
    }).catch((error) => {
      debug('Update failed with error');
      debug(error);
      callback(error);
    });
  },
});

documentService.bind(docService, grpc.ServerCredentials.createInsecure());
debug(`document service running at ${docService}`);
documentService.start();
