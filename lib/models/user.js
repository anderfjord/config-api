'use strict';

const USER_PATH = './data/users/';

/**
 * Core Dependencies
 */
var crypto = require('crypto')
  , fs = require('fs');

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http');

/**
 * Class User
 * 
 */
var User = function () {
    this.username = null;
    this.password = null;
};

/**
 * Static
 * @param string username
 * @return boolean
 */
User.getUserId = function (username) {
    return User.getHash('md5', username);
};

/**
 * Static
 * @param string username
 * @param function cb
 */
User.getByUsername = function (username, cb) {

    var userId = User.getUserId(username)
      , userPath = USER_PATH + userId + '.json';

    fs.readFile(userPath, {flag: 'r'}, function (err, data) {
        if (err) {
            return cb(null);
        }

        cb(JSON.parse(data));
    })
};

/**
 * Static
 * @param string type
 * @param string data
 * @return string
 */
User.getHash = function (type, data) {
    return crypto.createHash(type).update(data).digest('hex');
};

/**
 * Public
 */
User.prototype = {

    setUsername: function (username) {
        this.username = username.replace(/[^\w]/, '');
    },

    setPassword: function (password) {
        this.password = User.getHash('sha256', password);
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    save: function (cb) {

        var self = this
          , userPath = USER_PATH + User.getUserId(self.username) + '.json';

        var userData = JSON.stringify({ 
            username: self.username, 
            password: self.password // Encrypted when first set
        });

        fs.writeFile(userPath, userData, {flag: 'wx'}, function (err) {
            cb(!err);
        });
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    delete: function (cb) {

        // var self = this
        //   , userPath = USER_PATH + User.getUserId(self.username) + '.json';

        // fs.unlink(userPath, function (err) {
        //     cb(!err);
        // });
    }
};

module.exports = User;