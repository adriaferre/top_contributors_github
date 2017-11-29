'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const contributorsHelper = require('./lib/contributorsHelper');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
            return res.status(500).send({ message: 'Internal server error' })
        })
});

app.listen(3000, () => {
    console.log("service runing");
})

//for testing
module.exports = app;