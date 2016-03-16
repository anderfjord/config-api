'use strict';

/**
 * Core Dependencies
 */
var crypto = require('crypto')
  , fs = require('fs');

/**
 * Local Dependencies
 */
var hostConfig = require('../../config/host.json')


const SESSION_PATH = '../../data/sesssions/';

/**
 * @param string cookies
 * @param function cb
 * @return string
 */
var userAuthenticated = function (cookies, cb) {

    console.log('COOKIES: ', cookies);

    cb(false);

    // fs.exists(sessionPath, function (exists) {
    //     if (!exists) {

    //         var sessionFile = fs.createWriteStream(sessionPath, {
    //             flags: 'w',
    //             defaultEncoding: 'utf8',
    //             mode: '0o666'
    //         });

    //         sessionFile.write('This user is logged in');

    //         cb(sessionId);
    //     } else {
    //         establishSession(cb);
    //     }
    // });
};

/**
 * @param string salt
 * @return string
 */
var generateSessionId = function (salt) {
    var content = Math.random().toString() + Date.now() + salt;
    return crypto.createHash('sha512').update(content).digest('hex');
};

/**
 * @param function cb
 */
var establishSession = function (cb) {

    var sessionId = generateSessionId(hostConfig.salt)
      , sessionPath = SESSION_PATH + sessionID;

    fs.exists(sessionPath, function (exists) {
        if (!exists) {

            var sessionFile = fs.createWriteStream(sessionPath, {
                flags: 'w',
                defaultEncoding: 'utf8',
                mode: '0o666'
            });

            sessionFile.write('This user is logged in');

            cb(sessionId);
        } else {
            establishSession(cb);
        }
    });
};

/**
 * @param function cb
 */
var destroySession = function (cb) {

}

/**
 *
 */
var getSessionCookie = function (cb) {

}


module.exports = {

    userAuthenticated: userAuthenticated,

    generateSessionId: generateSessionId,

    establishSession: establishSession,

    destroySession: destroySession,

    getSessionCookie: getSessionCookie
}