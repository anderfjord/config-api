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
            '/configurations': function (req, res, sessionCookie) {
                
            }
        },

        POST: {
            // Create a new configuration
            '/configurations': function (req, res, sessionCookie) {
                
            }
        },

        PUT: {
            '/configurations': function (req, res, sessionCookie) {
                
            }
        },

        DELETE: {
            '/configurations': function (req, res, sessionCookie) {
                
            }
        }
    }
};