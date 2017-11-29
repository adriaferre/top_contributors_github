# TOP CONTRIBUTORS GITHUB

[![Build Status](https://travis-ci.org/adriaferre/top_contributors_github.svg?branch=master)](https://travis-ci.org/adriaferre/top_contributors_github)

## Requirements

+ *node version* v.8.9.1
+ *npm version* 5.5.1

## Usage
1. Install dependencies: ```npm install```
2. Start node server: ```npm start```
3. (Optional) Run tests: ```npm test```

## Note
In order to authentificate you have to send a header called ```authorization``` and the value has to be a JsonWebToken.
Example of request:
```
curl "https://topcontributors.herokuapp.com/contributors?city=Barcelona&top=50" -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vVG9rZW4iLCJleHAiOjk0OTc2MTkwNDcsImlhdCI6MTUxMTk2ODI1Nn0.kZcPrfTVgD75znBH5jvf_lVxTZdG3IJs6tVjlsnTBT8"
```


## Demo
[Demo in heroku](https://topcontributors.herokuapp.com/contributors?city=Barcelona)

Adrià Ferré Grau - 2017
