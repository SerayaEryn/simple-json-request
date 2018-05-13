'use strict';

const http = require('http');

module.exports = class HttpError extends Error {
  constructor(statusCode, data) {
    super(http.STATUS_CODES[statusCode]);
    this.statusCode = statusCode;
    this.code = http.STATUS_CODES[statusCode].toUpperCase().replace(/ /g, '_');
    this.data = data;
  }
}
