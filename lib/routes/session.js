'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , responseSrvc = require('../services/response')
  , Session = require('../models/session')
  , User = require('../models/user');

module.exports = {

    NOAUTH: {

        POST: {
            // Login
            '/sessions': function (req, res, sessionId) {

                if (sessionId) {
                    return responseSrvc.send(res, httpSrvc.OK);
                }

                var params;

                req.on('data', function (chunk) {
                    try {
                        params = JSON.parse(chunk.toString());
                    } catch (err) {
                        console.error('Error creating session: ' + err);
                    }
                });

                req.on ('end', function() {

                    if (!params || !params.username || !params.password) {
                        return responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                    }

                    User.getByUsername(params.username, function (userData) {

                        if (!userData) {
                            return responseSrvc.send(res, httpSrvc.NOT_FOUND);
                        }
                        else if (User.getHash('sha256', params.password) !== userData.password) {
                            return responseSrvc.send(res, httpSrvc.FORBIDDEN);
                        }

                        Session.create(User.getUserId(params.username), function (err, sessionId) {
                            if (err) {
                                responseSrvc.send(res, httpSrvc.CONFLICT);
                            } else {
                                var expiry = new Date();
                                expiry.setHours(+24);
                                responseSrvc.send(res, httpSrvc.OK, '', { 'Set-Cookie': 'SID=' + sessionId + '; Expires=' + expiry.toUTCString() });
                            }
                        });
                    });
                });
            }
        }
    },

    AUTH: {

        DELETE: {
            // Logout
            '/sessions': function (req, res, sessionId) {

                if (!sessionId) {
                    return responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                }

                Session.destroy(sessionId, function (err) {
                    if (err) {
                        responseSrvc.send(res, httpSrvc.GONE, { msg: "Session not deleted. It may no longer exist." });
                    } else {
                        responseSrvc.send(res, httpSrvc.OK);
                    }
                });
            }
        }
    }
};