'use strict';

module.exports = {

    send: function (res, statusCode, data, customHeaders) {

        if (data && typeof data === 'object') {
            data = JSON.stringify(data);
        } else {
            data = '';
        }

        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');

        if (customHeaders) {
            for (var header in customHeaders) {
                res.setHeader(header, customHeaders[header]);
            }
        }

        res.write(data);
        res.end();
    }
}