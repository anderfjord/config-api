'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , sessionSrvc = require('../services/session');

module.exports = {

    POST: {
        // Create a new session, i.e. Login
        '/sessions': function (req, res) {

            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {
                    sessionSrvc.establishSession(function (sessionId) {
                        res.statusCode = httpSrvc.OK;
                        res.setHeader('Set-Cookie', 'SID=' + sessionId);
                        res.end();
                    });
                } else {
                    res.statusCode = httpSrvc.OK;
                    res.end();
                }
            });
        }
    },

    DELETE: {
        '/sessions': function (req, res) {
            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {

                } else {
                    sessionSrvc.destroySession(function () {

                    });
                }
            });
        }
    }
};