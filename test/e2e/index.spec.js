/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
chai.use(require('chai-http'));
const util = require('./util');

const base = 'http://localhost:3001';
const { expect, request } = chai;

const tickets = [];

const checkDocument = (ticket, done) => {
  request(base)
    .get('/document')
    .query({ ticket })
    .end((err, res) => {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      const document = res.body;
      expect(document).to.haveOwnProperty('watermark');
      expect(document.watermark).to.haveOwnProperty('type');
      if (document.topic) {
        expect(document.watermark.type).to.be.equal('book');
      } else {
        expect(document.watermark.type).to.be.equal('journal');
      }
      done();
    });
};

const checkStatus = (ticket, done) => {
  request(base)
    .get('/status')
    .query({ ticket })
    .end((err, res) => {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      const status = res.text;
      if (status !== 'completed') {
        console.log(`current status of ${ticket} is ${status} waiting for completion`);
        setTimeout(() => {
          checkStatus(ticket, done);
        }, 1000);
      } else {
        checkDocument(ticket, done);
      }
    });
};

const createDocument = async (index, isBook = true) => {
  it(`Testingn on ${isBook ? 'book' : 'journal'} ${index}`, (done) => {
    request(base)
      .post('/watermark')
      .send(isBook ? util.getBook() : util.getJournal())
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        const ticket = res.text;
        tickets.push(ticket);
        checkStatus(ticket, done);
      });
  });
};


describe('user endpoint', function endpoint() {
  this.timeout(5000);
  const maxIndex = 10;
  for (let index = 0; index < maxIndex; index += 1) {
    createDocument(index, index < maxIndex / 2);
  }
});
