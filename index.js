'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const contributorsHelper = require('./lib/contributorsHelper');

const app = express();
const config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//AUTH MECHANISM
app.use(jwt({
    secret: config.JWT_SECRET,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
}));

app.use((err, req, res, next) => {
    if(err) {
        return res.status(err.status).send(err.inner)
    }
    return next();
});

app.get('/contributors', (req, res) => {
    let { city, top } = req.query;
    if(city === undefined) {
        return res.status(400).send({ message: 'city is not passed' });
    }
    if(top !== undefined) {
        top = parseInt(top, 10);
        if (isNaN(top)) {
            return res.status(400).send({ message: 'top must be an integer'});
        }
    }

    return contributorsHelper.getContributors(city, top)
        .then(result => res.status(200).send(result))
        .catch(err => {
            console.log(err);
            return res.status(500).send({ message: 'Internal server error' });
        });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("service runing");
});

//for testing
module.exports = app;