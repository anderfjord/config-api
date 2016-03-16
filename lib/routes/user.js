'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , responseSrvc = require('../services/response')
  , User = require('../models/user');

module.exports = {

    NOAUTH: {

        POST: {
            
            '/users': function (req, res, sessionId) {

                if (sessionId) {
                    return responseSrvc.send(res, httpSrvc.FORBIDDEN, {
                        msg: "Can't create a user while logged in"
                    });
                }

                var params;

                req.on('data', function (chunk) {
                    try {
                        params = JSON.parse(chunk.toString());
                    } catch (err) {
                        console.error('Error creating user: ' + err);
                    }
                });

                req.on ('end', function() {

                    if (!params || !params.username || !params.password) {
                        responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                        return;
                    }
                
                    var user = new User();
                    user.setUsername(params.username);
                    user.setPassword(params.password);

                    user.save(function (created) {

                        var statusCode;
                        var result = {
                            msg: "",
                            user_id: User.getUserId(params.username)
                        };

                        if (created) {
                            statusCode = httpSrvc.CREATED;
                            result.msg = "User created";
                        } else {
                            statusCode = httpSrvc.CONFLICT;
                            result.msg = "User already exists";
                        }

                        responseSrvc.send(res, statusCode, result);
                    });
                });
            }
        }
    },

    AUTH: {

        DELETE: {

            '/users': function (req, res, sessionId) {

                // You can only delete your own user account if you are currently authenticated
                if (!sessionId) {
                    var user = new User();
                    user.setUsername(req.params.username);
                    user.setPassword(req.params.password);

                    user.delete(function (deleted) {

                        var statusCode;

                        if (deleted) {
                            statusCode = httpSrvc.OK;
                        } else {
                            statusCode = httpSrvc.BAD_REQUEST;
                        }

                        responseSrvc.send(res, statusCode, {});
                    });
                }
                // Cannot delete your user account unless you're currently logged in
                else {
                    responseSrvc.send(res, httpSrvc.FORBIDDEN);
                }
            }
        }
    }
};