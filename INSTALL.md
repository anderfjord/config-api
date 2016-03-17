## Install Node.js and NPM
[Full instructions here](https://nodejs.org/en/download/package-manager/)

#### Mac OS X
`brew install node`

#### Ubuntu
`curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

## Install PM2 for process management
`npm install pm2 -g`

### Create directory for PM2 to store process pid files
`sudo mkdir /var/run/configlieri`

`sudo chown -R <app-user>:<app-user-group> /var/run/configlieri`

### Create directory for PM2 to store log files
`sudo mkdir /var/log/cconfiglieri`

`sudo chown -R <app-user>:<app-user-group> /var/log/configlieri`