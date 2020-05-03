/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
chai.use(require('chai-http'));
const util = require('./util');

const base = 'http://localhost:3001';
const { expect, request } = chai;

let savedTicket = '';

const checkDocument = (index) => {
  it(`Should have document with watermark on complete for document ${index}`, (done) => {
    const ticket = savedTicket;
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
  });
};

const checkStatus = (index) => {
  it(`Should check status till complete for the document ${index}`, (tempDone) => {
    const ticket = savedTicket;
    const singleCheck = (done) => {
      request(base)
        .get('/status')
        .query({ ticket })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          const status = res.text;
          if (status !== 'completed') {
            console.log(`\t\tcurrent status of ${ticket} is ${status} waiting for completion`);
            setTimeout(() => {
              singleCheck(done);
            }, 200);
          } else {
            done();
          }
        });
    };
    singleCheck(tempDone);
  });
};

const createDocument = async (index, isBook = true) => {
  it(`Creating ${isBook ? 'book' : 'journal'} ${index}`, (done) => {
    request(base)
      .post('/watermark')
      .send(isBook ? util.getBook() : util.getJournal())
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        const ticket = res.text;
        savedTicket = ticket;
        done();
      });
  });
};


describe('user full flow', () => {
  const maxIndex = 10;
  for (let index = 0; index < maxIndex; index += 1) {
    createDocument(index, index < maxIndex / 2);
    checkStatus(index);
    checkDocument(index);
  }
});
