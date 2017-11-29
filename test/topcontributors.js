const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const jwt = require('jsonwebtoken');

const server = require('../index');
const config = require('../config');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);

describe('GET /topcontributors', () => {
    const generateFakeArray = (num) => {
        let itemsArray = [];
        for (let i = 0; i < num; i++) itemsArray.push(i);
        return itemsArray;
    };

    const token = jwt.sign({sub: 'userId', exp: 9497619047}, config.JWT_SECRET);
    const tokenExpired = jwt.sign({sub: 'userId', exp: 0}, config.JWT_SECRET);

    beforeEach(done => {
        nock.cleanAll();
        done();
    })

    it('should not let me get the contributors list without auth token', (done) => {
        chai.request(server)
        .get('/contributors')
        .end((err, res) => {
            res.should.have.status(401);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('No authorization token was found');
            done();
        })
    });

    it('should not let me get the contributors list with an invalid auth token', (done) => {
        chai.request(server)
        .get('/contributors')
        .set('authorization', 'Bearer invalid_token_here')
        .end((err, res) => {
            res.should.have.status(401);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('jwt malformed');
            done();
        })
    });

    it('should not let me get the contributors list with an expired auth token', (done) => {
        chai.request(server)
        .get('/contributors')
        .set('authorization', `Bearer ${tokenExpired}`)
        .end((err, res) => {
            res.should.have.status(401);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('jwt expired');
            done();
        })
    });

    it('should not let me get the contributors list if no city is provided', (done) => {
        const mock = nock('https://api.github.com').get(/search\/users/).reply(200, { items: generateFakeArray(30)});

        chai.request(server)
        .get('/contributors')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('city is not passed');
            mock.isDone().should.equal(false);
            done();
        })
    });

    it('should not let me get the contributors list if top is not an integer', (done) => {
        const mock = nock('https://api.github.com').get(/search\/users/).reply(200, { items: generateFakeArray(30)});

        chai.request(server)
        .get('/contributors?city=barcelona&top=not_valid_limit')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.equal('top must be an integer');
            mock.isDone().should.equal(false);
            done();
        })
    });

    it('should let me get the contributors list with 30 results (default)', (done) => {
        const mock = nock('https://api.github.com').get(/search\/users/).reply(200, { items: generateFakeArray(30)});

        chai.request(server)
        .get('/contributors?city=barcelona')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(30);
            mock.isDone().should.equal(true);
            done();
        });
    });

    it('should let me get the top 50 contributors list', (done) => {
        const mock = nock('https://api.github.com').get(/search\/users/).reply(200, { items: generateFakeArray(50)});

        chai.request(server)
        .get('/contributors?city=barcelona&top=50')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            mock.isDone().should.equal(true);
            res.body.should.be.an('array');
            res.body.should.have.length(50);
            done();
        });
    });

    it('should let me get the top 100 contributors list', (done) => {
        const mock = nock('https://api.github.com').get(/search\/users/).reply(200, { items: generateFakeArray(100)});
        
        chai.request(server)
        .get('/contributors?city=barcelona&top=100')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(100);
            done();
        });
    });

    it('should let me get the top 150 contributors list', (done) => {
        const mockPage1 = nock('https://api.github.com').get(/search\/users.*page=1/).reply(200, { items: generateFakeArray(100)});
        const mockPage2 = nock('https://api.github.com').get(/search\/users.*page=2/).reply(200, { items: generateFakeArray(50)});

        chai.request(server)
        .get('/contributors?city=barcelona&top=150')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length(150);
            mockPage1.isDone().should.equal(true);
            mockPage2.isDone().should.equal(true);
            done();
        });
    });
});