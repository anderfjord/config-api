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
 * Public
 */
User.prototype = {

    setUsername: function (username) {
        var self = this;
        self.username = username.replace(/[^\w]/, '');
    },

    getUsernameHash: function (username) {
        return crypto.createHash('sha256').update(username).digest('hex');
    },

    setPassword: function (password) {
        var self = this;
        self.password = crypto.createHash('sha256').update(password).digest('hex');
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    save: function (cb) {

        var self = this
          , userPath = USER_PATH + self.getUsernameHash(username) + '.json';

        fs.exists(userPath, function (exists) {

            if (exists) {
                return cb(false);
            }

            fs.writeFile(userPath, JSON.stringify({ 
                username: self.username, 
                password: self.password // Encrypted when first set
            }), function (err) {
                cb(!err);
            });
        });
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    delete: function (cb) {

        var self = this
          , userPath = USER_PATH + self.getUsernameHash(username);

        fs.unlink(userPath, function (err) {
            cb(!err);
        });
    }
};

module.exports = User;