## Requirements
* [Node.js](http://nodejs.org/) -- v5.6.0
* [PM2](http://pm2.keymetrics.io/) -- v1.0.1

## Install requirements
See [INSTALL.md](INSTALL.md)

## Clone the repo
`git clone https://github.com/anderfjord/configlieri`

## Change into the project directory
`cd configlieri`

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
[http://ec2-54-175-0-34.compute-1.amazonaws.com:3000/]

To get started, you have to create a user acount and login so that you can start playing with configuration CRUD.

It's best to use something like [Google ARC](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo) for interacting with the API, since this allows you to retain the session cookie.

### Example Routes
Action | Route | Payload
--- | --- | ---
**Add User** | POST /users | { "username": "colonelsandurz", "password": "ch!ck3n" }
**Login** | POST /sessions | { "username": "colonelsandurz", "password": "ch!ck3n" }
**Logout** | DELETE /sessions | 
**Get All Configs** | GET /configurations | 
**Sort Configs - name asc** | GET /configurations?sort=+name | 
**Sort Configs - name desc** | GET /configurations?sort=-name | 
**Sort Configs - hostname asc** | GET /configurations?sort=+hostname | 
**Sort Configs - hostname desc** | GET /configurations?sort=-hostname | 
**Sort Configs - port asc** | GET /configurations?sort=+port | 
**Sort Configs - port desc** | GET /configurations?sort=-port | 
**Sort Configs - username asc** | GET /configurations?sort=+username | 
**Sort Configs - username desc** | GET /configurations?sort=-username | 
**Add Config** | POST /configurations | { "name": "2tonecold", "hostname": "x-y-z.abc.net", port: 187, "username": "serpico" }
**Get Config** | GET /configurations/2stonecold | 
**Modify Config** | PUT /configurations/2stonecold | { "hostname": "a-b-c.123.net", port: 781 }
**Delete Config** | DELETE /configurations/2stonecold | 
