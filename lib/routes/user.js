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
                        responseSrvc.send(res, httpSrvc.BAD_REQUEST, { msg: "Required fields: [username, password]" });
                        return;
                    }

                    User.create(params.username, params.password, function (created) {
                        var statusCode;
                        var result = {
                            msg: "",
                            username: params.username
                        };

                        if (created) {
                            statusCode = httpSrvc.CREATED;
                            result.msg = "User created";
                        } else {
                            statusCode = httpSrvc.CONFLICT;
                            result.msg = "Username already exists";
                        }

                        responseSrvc.send(res, statusCode, result);
                    });
                });
            }
        }
    },

    AUTH: {}
};