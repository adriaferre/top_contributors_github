'use strict';

const fetch = require('node-fetch');

const getContributorsByPage = (city, per_page = undefined, page = 1) => {
    let finalURI = 'https://api.github.com/search/users';
    finalURI += encodeURI(`?q=type:user location:${city} sort:repositories`);
    if (per_page !== undefined) {
        finalURI += `&per_page=${per_page}`;
    }
    finalURI += `&page=${page}`;

    return fetch(finalURI)
        .then(res => {
            if (res.status !== 200) {
                return Promise.reject();
            }
            return res.json();
        })
        .then(res => res.items);
}

const getContributors = (city, per_page = undefined) => {
    if (per_page === undefined || per_page <= 100) {
        return getContributorsByPage(city, per_page, 1);
    }

    //With Github API you can only retreive 100 users per page
    const promisesFetch = [
        getContributorsByPage(city, 100, 1)
    ];

    let actualPage = 2;
    let perPageCounter = per_page - 100;
    while (perPageCounter > 0) {
        if (perPageCounter <= 100) {
            promisesFetch.push(getContributorsByPage(city, perPageCounter, actualPage));
            perPageCounter -= perPageCounter;
        } else {
            promisesFetch.push(getContributorsByPage(city, 100, actualPage));
            perPageCounter -= 100;
        }
        actualPage += 1;
    }

    return Promise.all(promisesFetch)
        .then(results => results.reduce((previousValue, currentValue) => previousValue.concat(currentValue), []))
        .then(result => result)
        .catch(err => Promise.reject({ message: 'Error retreiving github information' }));
}

module.exports = { getContributors };