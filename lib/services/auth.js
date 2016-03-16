'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , responseSrvc = require('../services/response')
  , Session = require('../models/session');

/**
 * @param string cookies
 * @return string
 */
var getSessionId = function (cookies) {
    if (typeof cookies === 'string' && cookies.match(/SID=/)) {
        return cookies.split('SID=')[1].split(';')[0];
    } else {
        return null;
    }
};

var getCookieExpirationHeader = function (sessionId) {
    var expiry = new Date();
    expiry.setHours(-24);
    return { 'Set-Cookie': 'SID=' + sessionId + '; Expires=' + expiry.toUTCString() };
};

/**
 * @param object res
 * @param string cookies
 * @param function cb
 * @return string
 */
var authenticate = function (res, cookies, cb) {

    var sessionId = getSessionId(cookies);

    if (!sessionId) {
        return cb(null);
    }

    // Ensure the session cookie is valid
    Session.exists(sessionId, function (exists) {
        if (exists) {
            return cb(sessionId);
        } else {
            responseSrvc.send(res, httpSrvc.UNAUTHORIZED, {msg: "Session is no longer valid"}, getCookieExpirationHeader(sessionId));
        }
    });
};


module.exports = {

    authenticate: authenticate

}