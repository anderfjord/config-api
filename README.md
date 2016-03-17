## Requirements
* [Node.js](http://nodejs.org/) -- v5.6.0
* [MongoDB](https://www.mongodb.org/) -- v3.2.1
* [PM2](http://pm2.keymetrics.io/) -- v1.0.1

## Install requirements
See [INSTALL.md](INSTALL.md)

## Clone the repo
`git clone https://github.com/anderfjord/config-api`

## Change into the project directory
`cd config-api`

## Configure the app
See [CONFIG.md](CONFIG.md)

## Install local Node.js dependencies for unit testing
`npm install`

## Start the app
`pm2 start config/pm2.json`

## Run tests
`npm test`

Unit tests are run using [Mocha](https://mochajs.org/)

## Run tests with code coverage
`npm run coverage`

Open `coverage/lcov-report/index.html` in a browser

Code coverage is generated using [Istanbul](https://www.npmjs.com/package/istanbul) in conjunction with [Mocha](https://mochajs.org/)
