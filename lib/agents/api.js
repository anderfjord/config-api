'use strict';

/**
 * Core Dependencies
 */
var http = require('http');
  
/**
 * Local Dependencies
 */
var hostConfig = require('../../config/host.json')
  , routerSrvc = require('../services/router');

/**
 * Centralized error handling
 * @param string signal
 * @param string message
 */
var handleProcessExit = function (signal, message) {
    console.error('API process exited. {signal: "' + signal + '", message: "' + message + '"}');
    process.exit('SIGKILL');
};

process.on('SIGINT', handleProcessExit.bind(null, 'SIGINT', ''));
process.on('SIGHUP', handleProcessExit.bind(null, 'SIGHUP', ''));
process.on('SIGTERM', handleProcessExit.bind(null, 'SIGTERM', ''));

process.on('uncaughtException', function (err) {
    handleProcessExit('uncaughtException', err.toString() + ' -> ' + err.stack);
});

/**
 * Create the server and handle routes
 */
 http.createServer(function (req, res) {

    routerSrvc.loadRoutes(req, res);

}).listen(hostConfig.port, function () {

    console.log('-------------------------------------------------------------------------------');
    console.log(' Started ' + hostConfig.name + ' - ', hostConfig.port);
    console.log('-------------------------------------------------------------------------------');

});
