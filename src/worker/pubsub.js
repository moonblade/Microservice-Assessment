const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const subscriptionName = 'statusService';
const subscription = pubSubClient.subscription(subscriptionName);
module.exports = subscription;
