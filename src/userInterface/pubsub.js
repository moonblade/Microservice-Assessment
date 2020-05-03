const { PubSub } = require('@google-cloud/pubsub');
const debug = require('debug')('assess-userInterface-pubsub');

const pubSubClient = new PubSub();
const topic = 'assessment-status-update';
module.exports = {
  // messages are of the form
  // { ticket: ticket,
  //   status: statusString
  // }
  publish: async (message) => {
    const messageName = 'statusUpdate';
    debug('Publishing message');
    debug(message);
    const dataBuffer = Buffer.from(messageName);
    await pubSubClient.topic(topic).publish(dataBuffer, message);
    debug('Message published');
  },
};
