/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
chai.use(require('chai-http'));
const config = require('./config.js');

const { expect, request } = chai;

describe('watermarker', () => {
  it('should watermark the book', (done) => {
    request(config.base)
      .post('/watermark')
      .send(config.inputBook)
      .end((err, res) => {
        expect(err).to.equal(undefined);
        expect(res.status).to.equal(200);
        expect(res.body).to.haveOwnProperty('watermark');
        const { watermark } = res.body;
        expect(watermark).to.haveOwnProperty('title');
        expect(watermark).to.haveOwnProperty('author');
        expect(watermark).to.haveOwnProperty('type');
        expect(watermark).to.haveOwnProperty('topic');
        expect(watermark.type).to.equal('book');
        done();
      });
  });
  it('should watermark the journal', (done) => {
    request(config.base)
      .post('/watermark')
      .send(config.inputJournal)
      .end((err, res) => {
        expect(err).to.equal(undefined);
        expect(res.status).to.equal(200);
        expect(res.body).to.haveOwnProperty('watermark');
        const { watermark } = res.body;
        expect(watermark).to.haveOwnProperty('title');
        expect(watermark).to.haveOwnProperty('author');
        expect(watermark).to.haveOwnProperty('type');
        expect(watermark.type).to.equal('journal');
        done();
      });
  });
});
