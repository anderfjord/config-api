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


## Usage
The app is hosted on AWS here:
http://

To get started, you have to create a user acount and login so that you can start playing with configuration CRUD.

It's best to use something like [Google ARC]() for interacting with the API, since this allows you to retain the session cookie.

### Example Routes
Action | Route | Payload
--- | --- | ---
**Add User** | POST /users | {username: "colonelsandurz", password: "ch!ck3n"}
**Login** | POST /sessions | {username: "colonelsandurz", password: "ch!ck3n"}
**Logout** | DELETE /sessions | 
**Get All Configs** | GET /configurations | 
**Get Configs - Sort name asc** | GET /configurations?sort=+name | 
**Get Configs - Sort name desc** | GET /configurations?sort=-name | 
**Get Configs - Sort port asc** | GET /configurations?sort=+port | 
**Get Configs - Sort port desc** | GET /configurations?sort=-port | 
