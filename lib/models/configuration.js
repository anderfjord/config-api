'use strict';

const CONFIGURATION_PATH = './data/configurations/';

/**
 * Core Dependencies
 */
var fs = require('fs');

/**
 * Class Session
 * 
 */
var Configuration = function () {
    this.name = null;
    this.hostname = null;
    this.port = null;
    this.username = null;
};

/**
 * Static
 * @param function cb
 */
Configuration.getAll = function (params, cb) {

    var configs = { configurations: [] };

    var fileCount = 0
      , filesRead = 0;

    fs.readdir(CONFIGURATION_PATH, function (err, files) {
        
        if (err) {
            return cb(configs);
        }

        fileCount = files.length;

        files.forEach(function (file) {

            // Skip files that begin with '.'
            if (file.indexOf('.') === 0) {
                filesRead += 1;
                return;
            }

            fs.readFile(CONFIGURATION_PATH + file, {flag: 'r'}, function (err, data) {
                filesRead += 1;
                
                if (!err) {
                    configs.configurations.push(data.toString());
                }

                if (filesRead === fileCount) {
                    cb(configs);
                }
            });
        });
    });
};

/**
 * Static
 * @param object params
 * @param function cb
 */
Configuration.create = function (params, cb) {
    var config = new Configuration();
    config.setName(params.name);
    config.setHostname(params.hostname);
    config.setPort(params.port);
    config.setUsername(params.username);
    config.save(cb);
};

/**
 * Static
 * @param string name
 * @param function cb
 */
Configuration.destroy = function (name, cb) {
    var config = new Configuration();
    config.setName(name);
    config.delete(cb);
};

/**
 * Public
 */
Configuration.prototype = {

    setName: function (name) {
        this.name = name;
    },

    setHostname: function (hostname) {
        this.hostname = hostname;
    },

    setPort: function (port) {
        this.port = parseInt(port, 10);
    },

    setUsername: function (username) {
        this.username = username;
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    save: function (cb) {

        var self = this
          , configPath = CONFIGURATION_PATH + self.name + '.json';

        var config = {
            name: self.name,
            hostname: self.hostname,
            port: self.port,
            username: self.username
        };

        fs.writeFile(configPath, JSON.stringify(config), {flag: 'wx'}, function (err) {
            cb(err, self.name);
        });
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    delete: function (cb) {

        var self = this
          , configPath = CONFIGURATION_PATH + self.name;

        fs.unlink(configPath, function (err) {
            cb(err);
        });
    }
};

module.exports = Configuration;