const { PubSub } = require('@google-cloud/pubsub');
const debug = require('debug')('assess-worker-pubsub');

const pubSubClient = new PubSub();
const topic = 'assessment-status-update';
const subscriptionName = 'statusWorker';
const subscription = pubSubClient.subscription(subscriptionName);

module.exports = {
  subscription,
  publish: async (message) => {
    const messageName = 'statusUpdate';
    debug('Publishing message');
    debug(message);
    const dataBuffer = Buffer.from(messageName);
    await pubSubClient.topic(topic).publish(dataBuffer, message);
    debug('Message published');
  },
};
