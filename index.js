'use strict';

const simpleGet = require('simple-get');
const http = require('http');

function request(options) {
  return new Promise((resolve, reject) => {
    simpleGet.concat(options, (error, response, data) => {
      if (error) {
        reject(error);
      } else if (response.statusCode >= 400) {
        reject(new HttpError(response.statusCode));
      } else {
        try {
          const parsedData = JSON.parse(data.toString());
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function get(options) {
  options.method = 'GET';
  return request(options);
}

function post(options) {
  options.method = 'POST';
  return request(options);
}

class HttpError extends Error {
  constructor(statusCode) {
    super(http.STATUS_CODES[statusCode]);
    this.statusCode = statusCode;
    this.code = http.STATUS_CODES[statusCode].toUpperCase().replace(/ /g, '_');
  }
}

module.exports = {
  request,
  get,
  post
};