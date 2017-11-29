const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const server = require('../index');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);

describe('GET /topcontributors', () => {
    beforeEach(done => {
        nock.cleanAll();
        done();
    })

    it('should not let me get the contributors list if no city is provided', (done) => {
        chai.request(server)
        .get('/contributors')
        .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('city is not passed');
            done();
        })
    });

    it('should not let me get the contributors list if top is not an integer', (done) => {
        chai.request(server)
        .get('/contributors?city=barcelona&top=not_valid_limit')
        .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('top must be an integer');
            done();
        })
    });

    it('should let me get the contributors list with 30 results (default)', (done) => {
        chai.request(server)
        .get('/contributors?city=barcelona')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(30);
            done();
        });
    });

    it('should let me get the top 50 contributors list', (done) => {
        chai.request(server)
        .get('/contributors?city=barcelona&top=50')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(50);
            done();
        });
    });

    it('should let me get the top 100 contributors list', (done) => {
        chai.request(server)
        .get('/contributors?city=barcelona&top=50')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(100);
            done();
        });
    });

    it('should let me get the top 150 contributors list', (done) => {
        chai.request(server)
        .get('/contributors?city=barcelona&top=150')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(150);
            done();
        });
    });
});