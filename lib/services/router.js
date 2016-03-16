'use strict';

/**
 * Master route specification
 */
var ROUTES = { GET: {}, POST: {}, PUT: {}, DELETE: {} };

/**
 * Load all defined routes
 */
(function () {

    var routeTypes = ['configuration', 'session', 'user'];

    routeTypes.forEach(function (routeType) {

        var routes = require('../routes/' + routeType)
          , method
          , url;

        for (method in routes) {
            for (url in routes[method]) {
                ROUTES[method][url] = routes[method][url];
            }
        }
    });
})();

/**
 * @param object req
 * @param object res
 */
var loadRoutes = function (req, res) {

    var method = req.method.toUpperCase()
      , url = req.url;

    if (ROUTES[method] && ROUTES[method][url]) {
        ROUTES[method][url](req, res);
    } else {
        res.statusCode = 404;
        res.end();
    }
};


module.exports = {

    loadRoutes: loadRoutes

}