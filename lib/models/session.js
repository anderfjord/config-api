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
    this.userSalt = null;
    this.userIpAddress = null;
    this.userAgent = null;
};

/**
 * Public
 */
Session.prototype = {

    setSessionId: function (sessionId) {
        this.sessionId = sessionId.slice(0, 200);
    },

    setUserId: function (userId) {
        this.userId = userId.slice(0, 50);
    },

    setUserSalt: function (userSalt) {
        this.userSalt = userSalt;
    },

    setUserIpAddress: function (userIpAddress) {
        this.userIpAddress = userIpAddress.slice(0, 30);
    },

    setUserUserAgent: function (userAgent) {
        this.userAgent = userAgent.slice(0, 200);
    },

    /**
     * @param function cb
     * @resolve boolean
     */
    save: function (cb) {

        var self = this
          , sessionPath = SESSION_PATH + self.sessionId
          , sessionStartDate = new Date();

        var data = {
            userId: self.userId,
            userIpAddress: self.userIpAddress,
            userAgent: self.userAgent,
            started: sessionStartDate.toUTCString(),
            ts: sessionStartDate.getTime()
        }

        fs.writeFile(sessionPath, JSON.stringify(data), {flag: 'wx'}, function (err) {
            cb(err, self.sessionId);
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


/**
 * STATIC
 */
 
/**
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
 * @param object userData
 * @param string userIpAddress
 * @param string userAgent
 * @param function cb
 */
Session.create = function (userData, userIpAddress, userAgent, cb) {
    var session = new Session();
    session.setSessionId(Session.generateId(userData.salt));
    session.setUserId(userData.userId);
    session.setUserIpAddress(userIpAddress);
    session.setUserUserAgent(userAgent);
    session.save(cb);
};

/**
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


module.exports = Session;