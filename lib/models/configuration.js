'use strict';

const CONFIGURATION_PATH = './data/configurations/';
const DEFAULT_PAGE_ITEM_COUNT = 10;
const MAX_PAGE_ITEM_COUNT = 100;

/**
 * Core Dependencies
 */
var fs = require('fs');

/**
 * Class Configuration
 * 
 */
var Configuration = function () {
    this.name = null;
    this.hostname = null;
    this.port = null;
    this.username = null;
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
        port = parseInt(port, 10);

        if (!isNaN(port)) {
            this.port = port;
        }
    },

    setUsername: function (username) {
        this.username = username;
    },

    /**
     * @param function errIfExists
     * @param function cb
     */
    save: function (errIfExists, cb) {

        var self = this
          , configPath = CONFIGURATION_PATH + self.name + '.json'
          , flag = 'w';

        if (errIfExists) {
            flag = 'wx';
        }

        var config = {
            name: self.name,
            hostname: self.hostname,
            port: self.port,
            username: self.username
        };

        fs.writeFile(configPath, JSON.stringify(config), {flag: flag}, function (err) {
            cb(err, config);
        });
    },

    /**
     * @param string name
     * @param function cb
     * @resolve boolean
     */
    delete: function (name, cb) {

        var self = this
          , configPath = CONFIGURATION_PATH + name + '.json';

        fs.unlink(configPath, function (err) {
            cb(err);
        });
    }
};


/**
 * STATIC
 */

/**
 * @param object params
 * @param function cb
 */
Configuration.getAll = function (params, cb) {

    var configs = [];

    var fileCount = 0
      , filesRead = 0;

    fs.readdir(CONFIGURATION_PATH, function (err, files) {
        
        if (err) {
            return cb({ configurations: configs });
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
                    configs.push(JSON.parse(data.toString()));
                }

                if (filesRead === fileCount) {

                    if (params.sort || params.page) {
                        Configuration.transform(configs, params, function (transformedConfigs) {
                            cb({ configurations: transformedConfigs });
                        });
                    } else {
                        cb({ configurations: configs });
                    }
                }
            });
        });
    });
};

/**
 * @param object configs
 * @param object params
 * @param function cb
 */
Configuration.transform = function (configs, params, cb) {

    var sortField = params.sort
      , sortFirstChar = params.sort.slice(0, 1)
      , sortDirection = 'asc'
      , pageNum = 1
      , pageItemCount = DEFAULT_PAGE_ITEM_COUNT
      , startIndex = 0
      , segmentLength = 10;

    if (params.sort) {

        if ('-' === sortFirstChar) {
            sortDirection = 'desc';
        }
        
        // '+' gets converted to ' ' by querystring, so we have to account for both
        if (['+', ' ', '-'].indexOf(sortFirstChar) > -1) {
            sortField = params.sort.slice(1);
        }
        
        configs.sort(function (a, b) {
            if (a[sortField] > b[sortField]) { return 'desc' === sortDirection ? -1 : 1; }
            if (a[sortField] < b[sortField]) { return 'desc' === sortDirection ? 1 : -1; }
            return 0;
        });
    }

    if (typeof params.page !== 'undefined' || typeof params.count !== 'undefined') {
        
        if (Number(params.page) > 0) {
            pageNum = parseInt(params.page, 10);
        }

        if (Number(params.count) > 0 && Number(params.count) < MAX_PAGE_ITEM_COUNT) {
            pageItemCount = parseInt(params.count, 10);
        }

        startIndex = (pageNum * pageItemCount) - pageItemCount;
        segmentLength = (pageNum * pageItemCount);

        configs = configs.slice(startIndex, segmentLength);
    }

    cb(configs);
};

/**
 * @param string field
 * @param string direction
 */
Configuration.sortBy = function (field, direction) {    

    return (function (a, b) {

        var gt = 1, lt = -1;

        if ('desc' === direction) {
            gt = -1;
            lt = 1;
        }

        console.log('GT: ', gt);
        console.log('LT: ', lt);

        if (a[field] > b[field]) { return gt; }
        if (a[field] < b[field]) { return lt; }
        return 0;
    });
};

/**
 * @param string name
 * @param boolean wrapResult
 * @param function cb
 */
Configuration.get = function (name, wrapResult, cb) {
    
    var configs = { configurations: [] }
      , configPath = CONFIGURATION_PATH + name + '.json';

    fs.readFile(configPath, {flag: 'r'}, function (err, data) {

        if (err) {
            return cb(err);
        }

        data = data.toString();

        if (wrapResult) {
            configs.configurations.push(data);
            cb(err, configs);
        } else {
            cb(err, data);
        }
    });
};

/**
 * @param object params
 * @param function cb
 */
Configuration.create = function (params, cb) {
    var config = new Configuration();
    config.setName(params.name);
    config.setHostname(params.hostname);
    config.setPort(params.port);
    config.setUsername(params.username);
    config.save(true, cb);
};

/**
 * @param string name
 * @param object params
 * @param function cb
 */
Configuration.update = function (name, params, cb) {

    var nameHasChanged = false;

    Configuration.get(name, false, function (err, existingConfig) {

        if (err) {
            return cb(err);
        }

        existingConfig = JSON.parse(existingConfig);

        if (params.name !== existingConfig.name) {
            nameHasChanged = true
        }

        var config = new Configuration();
        
        // Set the initial values before overriding
        config.setName(name);
        config.setHostname(existingConfig.hostname);
        config.setPort(existingConfig.port);
        config.setUsername(existingConfig.username);

        if (params.name)        { config.setName(params.name); }
        if (params.hostname)    { config.setHostname(params.hostname); }
        if (params.port)        { config.setPort(params.port); }
        if (params.username)    { config.setUsername(params.username); }

        config.save(nameHasChanged, function (err, config) {
            
            // Delete the old config file if the name has been changed
            if (nameHasChanged) {

                // Error was likely due to non-unique name change
                if (err) {
                    return cb(err, config, true);
                }

                Configuration.destroy(existingConfig.name, function (err) {
                    cb(err, config);
                });   
            } else {
                cb(err, config);
            }
        });
    });
};

/**
 * @param string name
 * @param function cb
 */
Configuration.destroy = function (name, cb) {
    var config = new Configuration();
    config.setName(name);
    config.delete(name, cb);
};


module.exports = Configuration;