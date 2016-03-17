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
        this.username = username.replace(/[^\w]/, '').slice(0, 50);
    },

    setPassword: function (password) {
        this.password = User.getHash('sha256', password.slice(0, 50));
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


/**
 * STATIC
 */

/**
 * @param string username
 * @param string password
 * @param function cb
 */
User.create = function (username, password, cb) {
    var user = new User();
    user.setUsername(username);
    user.setPassword(password);
    user.save(cb);
};

/**
 * @param string username
 * @return boolean
 */
User.getUserId = function (username) {
    return User.getHash('md5', username);
};

/**
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
 * @param string type
 * @param string data
 * @return string
 */
User.getHash = function (type, data) {
    return crypto.createHash(type).update(data).digest('hex');
};


module.exports = User;