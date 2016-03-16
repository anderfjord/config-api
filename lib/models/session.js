'use strict';

const SESSION_PATH = './data/sessions/';

/**
 * Core Dependencies
 */
var crypto = require('crypto')
  , fs = require('fs');

/**
 * Local Dependencies
 */
var hostConfig = require('../../config/host.json')
  , httpSrvc = require('../services/http');

/**
 * Class Session
 * 
 */
var Session = function () {
    this.sessionId = null;
    this.userId = null;
};

/**
 * Static
 * @param string sessionId
 * @param function cb
 * @resolve boolean
 */
Session.exists = function (sessionId, cb) {
    var sessionPath = SESSION_PATH + sessionId;

    fs.readFile(sessionPath, {flag: 'r'}, function (err) {
        if (err) {
            cb(false);
        } else {
            cb(true);
        }
    });
};

/**
 * Static
 * @param string userId
 * @param function cb
 */
Session.create = function (userId, cb) {
    var session = new Session();
    session.setSessionId(Session.generateId(hostConfig.salt));
    session.setUserId(userId);
    session.save(cb);
};

/**
 * Static
 * @param string sessionId
 * @param function cb
 */
Session.destroy = function (sessionId, cb) {
    var session = new Session();
    session.setSessionId(sessionId);
    session.delete(cb);
};

/**
 * @param string salt
 * @return string
 */
Session.generateId = function (salt) {
    var content = Math.random().toString() + Date.now() + salt;
    return crypto.createHash('sha512').update(content).digest('hex');
};

/**
 * Public
 */
Session.prototype = {

    setSessionId: function (sessionId) {
        this.sessionId = sessionId;
    },

    setUserId: function (userId) {
        this.userId = userId;
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    save: function (cb) {

        var self = this
          , sessionId = Session.generateId(hostConfig.salt)
          , sessionPath = SESSION_PATH + sessionId;

        fs.writeFile(sessionPath, self.userId, {flag: 'wx'}, function (err) {
            cb(err, sessionId);
        });
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    delete: function (cb) {

        var self = this
          , sessionPath = SESSION_PATH + self.sessionId;

        fs.unlink(sessionPath, function (err) {
            cb(err);
        });
    }
};

module.exports = Session;