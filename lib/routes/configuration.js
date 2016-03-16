'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , responseSrvc = require('../services/response')
  , Configuration = require('../models/configuration');

module.exports = {

    NOAUTH: {},

    AUTH: {

        GET: {

            '/configurations': function (req, res, sessionId) {

                var params;

                Configuration.getAll(params, function (configs) {
                    responseSrvc.send(res, httpSrvc.OK, configs);
                });
            },

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {
                
            }
        },

        POST: {

            '/configurations': function (req, res, sessionId) {

                var params;

                req.on('data', function (chunk) {
                    try {
                        params = JSON.parse(chunk.toString());
                    } catch (err) {
                        console.error('Error creating configuration: ' + err);
                    }
                });

                req.on ('end', function() {

                    if (!params || !params.name || !params.hostname || !params.port || !params.hostname) {
                        responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                        return;
                    }
                
                    Configuration.create(params, function (err, name) {
                        if (err) {
                            responseSrvc.send(res, httpSrvc.CONFLICT, { msg: "Configuration already exists", name: name });
                        } else {
                            responseSrvc.send(res, httpSrvc.OK, { msg: "Configuration created", name: name });
                        }
                    });
                });
            }
        },

        PUT: {

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {
                
            }
        },

        DELETE: {

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {
                
                if (!configName) {
                    return responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                }

                Configuration.destroy(configName, function (err) {
                    if (err) {
                        responseSrvc.send(res, httpSrvc.GONE, { msg: "Configuration not deleted. It may no longer exist." });
                    } else {
                        responseSrvc.send(res, httpSrvc.OK);
                    }
                });
            }
        }
    }
};