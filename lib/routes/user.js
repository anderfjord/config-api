'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , sessionSrvc = require('../services/session')
  , User = require('../models/user');

module.exports = {

    POST: {
        // Create a new user
        '/users': function (req, res) {

            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {

                // You can only create a user if you are not currently authenticated
                if (!isAuthenticated) {

                    var body;

                    req.on('data', function (chunk) {
                        try {
                            body = JSON.parse(chunk.toString());
                        } catch (err) {
                            console.error('Error creating user: ' + err);
                        }
                    });

                    req.on ('end', function() {

                        if (!body || !body.username || !body.password) {
                            res.statusCode = httpSrvc.BAD_REQUEST;
                            res.end();
                            return;
                        }
                    
                        var user = new User();
                        user.setUsername(body.username);
                        user.setPassword(body.password);
                        user.save(function (created) {

                            var statusCode;

                            if (created) {
                                res.statusCode = httpSrvc.CREATED;
                            } else {
                                res.statusCode = httpSrvc.CONFLICT;
                            }

                            res.end();
                        });
                    });
                }
                // Cannot create a new user while you're currently logged in
                else {
                    res.statusCode = httpSrvc.FORBIDDEN;
                    res.end();
                }
            });
        }
    },

    DELETE: {

        '/users': function (req, res) {

            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {

                // You can only delete your own user account if you are currently authenticated
                if (!isAuthenticated) {
                    var user = new User();
                    user.setUsername(req.params.username);
                    user.setPassword(req.params.password);

                    user.delete(function (deleted) {
                        if (deleted) {
                            res.statusCode = httpSrvc.OK;
                        } else {
                            res.statusCode = httpSrvc.BAD_REQUEST;
                        }
                        res.end();
                    });
                }
                // Cannot delete your user account unless you're currently logged in
                else {
                    res.statusCode = httpSrvc.FORBIDDEN;
                    res.end();
                }
            });
        }
    }
};