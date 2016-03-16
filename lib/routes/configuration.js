'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , sessionSrvc = require('../services/session');

module.exports = {

    GET: {
        '/configurations': function (req, res) {
            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {

                } else {

                }
            });
        }
    },

    POST: {
        // Create a new configuration
        '/configurations': function (req, res) {
            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {

                } else {

                }
            });
        }
    },

    PUT: {
        '/configurations': function (req, res) {
            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {

                } else {
                    
                }
            });
        }
    },

    DELETE: {
        '/configurations': function (req, res) {
            sessionSrvc.userAuthenticated(req.headers.cookie, function (isAuthenticated) {
                if (!isAuthenticated) {

                } else {
                    
                }
            });
        }
    }
};