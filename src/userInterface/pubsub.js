const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const topic = 'assessment-status-update';
module.exports = {
  // messages are of the form
  // { ticket: ticket,
  //   status: statusString
  // }
  publish: async (message) => {
    const messageName = 'statusUpdate';
    const dataBuffer = Buffer.from(messageName);
    await pubSubClient.topic(topic).publish(dataBuffer, message);
  },
};
