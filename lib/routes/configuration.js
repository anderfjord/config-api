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

            '/configurations': function (req, res, sessionId, queryParams) {
                Configuration.getAll(queryParams, function (configs) {
                    responseSrvc.send(res, httpSrvc.OK, configs);
                });
            },

            '/configurations/?\\?([-\+%=\\w&]+)$': function (req, res, sessionId, queryParams) {
                Configuration.getAll(queryParams, function (configs) {
                    responseSrvc.send(res, httpSrvc.OK, configs);
                });
            },

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {

                Configuration.get(configName, true, function (err, configs) {
                    if (err) {
                        responseSrvc.send(res, httpSrvc.NOT_FOUND, { msg: "Configuration not found." });
                    } else {
                        responseSrvc.send(res, httpSrvc.OK, configs);
                    }
                });
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
                
                    Configuration.create(params, function (err, config) {
                        if (err) {
                            responseSrvc.send(res, httpSrvc.CONFLICT, { msg: "Configuration already exists.", config: config });
                        } else {
                            responseSrvc.send(res, httpSrvc.OK, { msg: "Configuration created.", config: config });
                        }
                    });
                });
            }
        },

        PUT: {

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {
                
                var params;

                req.on('data', function (chunk) {
                    try {
                        params = JSON.parse(chunk.toString());
                    } catch (err) {
                        console.error('Error updating configuration: ' + err);
                    }
                });

                req.on ('end', function() {

                    if (!params || (!params.name && !params.hostname && !params.port && !params.hostname)) {
                        responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                        return;
                    }
                
                    Configuration.update(configName, params, function (err, config, duplicate) {
                        if (err) {
                            if (duplicate) {
                                responseSrvc.send(res, httpSrvc.CONFLICT, { msg: "Configuration not updated. Name already exists.", name: params.name });
                            } else {
                                responseSrvc.send(res, httpSrvc.GONE, { msg: "Configuration not updated. It may no longer exist.", name: configName });
                            }
                        } else {
                            responseSrvc.send(res, httpSrvc.OK, { msg: "Configuration updated.", config: config });
                        }
                    });
                });
            }
        },

        DELETE: {

            '/configurations/([-\\w]+)$': function (req, res, sessionId, configName) {
                
                if (!configName) {
                    return responseSrvc.send(res, httpSrvc.BAD_REQUEST);
                }

                Configuration.destroy(configName, function (err) {
                    if (err) {
                        responseSrvc.send(res, httpSrvc.GONE, { msg: "Configuration not deleted. It may no longer exist.", name: configName });
                    } else {
                        responseSrvc.send(res, httpSrvc.OK, { msg: "Configuration deleted.", config: configName });
                    }
                });
            }
        }
    }
};