'use strict';

/**
 * Local Dependencies
 */
var httpSrvc = require('../services/http')
  , authSrvc = require('../services/auth')
  , responseSrvc = require('../services/response');

/**
 * Master route specification
 */
var NOAUTH_ROUTES = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
var AUTH_ROUTES = { GET: {}, POST: {}, PUT: {}, DELETE: {} };

/**
 * Load all defined routes
 */
(function () {

    var routeTypes = ['configuration', 'session', 'user'];

    routeTypes.forEach(function (routeType) {

        var routes = require('../routes/' + routeType)
          , authType
          , method
          , url;

        // Merge all route types 
        for (authType in routes) {
            for (method in routes[authType]) {
                for (url in routes[authType][method]) {

                    if ('NOAUTH' === authType) {
                        NOAUTH_ROUTES[method][url] = routes[authType][method][url];
                    } else {
                        AUTH_ROUTES[method][url] = routes[authType][method][url];
                    }
                }
            }
        }
    });
})();

/**
 * @param object req
 * @param object res
 */
var handleRequests = function (req, res) {

    authSrvc.authenticate(res, req.headers.cookie, function (sessionId) {

        var method = req.method.toUpperCase()
          , url = req.url;

        // Require authentication unless route is explicity defined as not requiring it
        if (!sessionId && AUTH_ROUTES[method][url]) {
            return responseSrvc.send(res, httpSrvc.UNAUTHORIZED);
        }

        // Try static routes first
        if (AUTH_ROUTES[method] && AUTH_ROUTES[method][url]) {
            return AUTH_ROUTES[method][url](req, res, sessionId);
        }
        else if (NOAUTH_ROUTES[method] && NOAUTH_ROUTES[method][url]) {
            return NOAUTH_ROUTES[method][url](req, res, sessionId);
        }

        // Perform pattern-matching against AUTH routes
        for (var urlPattern in AUTH_ROUTES[method]) {
        
            var re = new RegExp(urlPattern)
              , matches = re.exec(url);

            if (matches) {
                return AUTH_ROUTES[method][urlPattern](req, res, sessionId, matches[1]);
            }
        }

        // Invalid route
        responseSrvc.send(res, httpSrvc.NOT_FOUND);
    });
};


module.exports = {

    handleRequests: handleRequests

}