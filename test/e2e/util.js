const rand = require('randomstring').generate;

module.exports = {
  getBook: () => ({
    title: rand(),
    author: rand(),
    topic: rand(),
    content: rand(),
  }),
  getJournal: () => ({
    title: rand(),
    author: rand(),
    content: rand(),
  }),
};
